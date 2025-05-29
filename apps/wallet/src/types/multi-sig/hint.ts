import {
  TxHintBag,
  TxSinglePublicHint,
  TxSingleSecretHint,
} from '@/types/multi-sig/tx';
import { secp256k1 } from '@noble/curves/secp256k1';
import { Buffer } from 'buffer';

export enum MultiSigDataHintType {
  SIMULATED = 'simulated',
  REAL = 'real',
}

export class MultiSigDataHint {
  constructor(
    protected inputIndex: number,
    protected publicKeyIndex: number,
    protected commit = Buffer.from('', 'hex'),
    protected proof = Buffer.from('', 'hex'),
    protected secret = Buffer.from('', 'hex'),
    protected type: MultiSigDataHintType = MultiSigDataHintType.REAL,
  ) {}

  public get Type() {
    return this.type;
  }

  public get Commit() {
    return this.commit.toString('hex');
  }

  public get Proof() {
    return this.proof.toString('hex');
  }

  public get Secret() {
    return this.secret.toString('hex');
  }

  /**
   * Creates a deep copy of the current MultiSigDataHint instance
   *
   * @returns A new MultiSigDataHint object with the same property values
   */
  clone = (): MultiSigDataHint => {
    return new MultiSigDataHint(
      this.inputIndex,
      this.publicKeyIndex,
      this.commit,
      this.proof,
      this.secret,
      this.type,
    );
  };

  /**
   * Checks equality between this hint and another MultiSigDataHint instance
   *
   * Comparison is based on the commit value and the type of the hint.
   * Other properties such as proof and secret are not considered in the equality check.
   *
   * @param other - Another MultiSigDataHint instance to compare with
   * @returns true if both hints have the same commit and type, false otherwise
   */
  equals = (other: MultiSigDataHint): boolean =>
    this.commit.toString('hex') === other.commit.toString('hex') &&
    this.type === other.type;

  /**
   * Converts the hint data to a base64-encoded string representation
   *
   * This method serializes the hint's data into a binary format and then encodes it as base64.
   * The serialized data contains:
   * - The commit (33 bytes)
   * - The proof (56 bytes, if present)
   * - A type indicator (1 byte, only for SIMULATED type)
   *
   * If there's no proof, only the commit is returned.
   *
   * @returns A base64-encoded string representing the serialized hint data
   */
  serialize = (): string => {
    // If there's no proof, return only the commit
    if (!this.hasProof()) return this.commit.toString('base64');

    const isSimulated = this.type === MultiSigDataHintType.SIMULATED;

    // Calculate buffer size based on what we're including
    const bufferSize = 33 + 56 + (isSimulated ? 1 : 0); // commit + proof + (type indicator only for SIMULATED)
    const buffer = Buffer.alloc(bufferSize);

    // Copy commit bytes to buffer
    this.commit.copy(buffer, 0);
    this.proof.copy(buffer, 33);

    // Set type indicator byte (only for SIMULATED)
    isSimulated && (buffer[33 + 56] = 1);

    // Convert buffer to base64
    return buffer.toString('base64');
  };

  /**
   * Creates a MultiSigDataHint instance from a base64 string
   *
   * This method parses a base64-encoded string into its component parts:
   * - commit (first 33 bytes)
   * - proof (next 56 bytes, if present)
   * - hint type (final byte, to identify SIMULATED type)
   *
   * @param hintBase64 - The base64 string containing hint data
   * @param inputIndex - The input index associated with this hint
   * @param signerIndex - The signer index associated with this hint
   * @returns A new MultiSigDataHint instance
   */
  static deserialize = (
    hintBase64: string,
    inputIndex: number,
    signerIndex: number,
  ): MultiSigDataHint => {
    // Decode base64 string to bytes
    const bytes = Buffer.from(hintBase64, 'base64');

    // Extract commit (first 33 bytes)
    const commit = Buffer.from(bytes.subarray(0, 33));

    // Extract proof and type with conditional operators
    const proof =
      bytes.length > 33
        ? Buffer.from(bytes.subarray(33, 33 + 56))
        : Buffer.from('');
    const type =
      bytes.length > 33 + 56 && bytes[33 + 56] === 1
        ? MultiSigDataHintType.SIMULATED
        : MultiSigDataHintType.REAL;

    return new MultiSigDataHint(
      inputIndex,
      signerIndex,
      commit,
      proof,
      undefined,
      type,
    );
  };

  /**
   * Checks if this hint contains a proof
   *
   * This method simply checks the length of the proof string to determine if data exists.
   *
   * @returns true if proof exists, false otherwise
   */
  hasProof = (): boolean => this.proof.length > 0;

  /**
   * Extracts the challenge part from the proof
   *
   * This method extracts the first 24 bytes of the proof as the challenge.
   * The challenge is used in the Schnorr protocol for signature verification.
   *
   * @returns Buffer containing the challenge (first 24 bytes of proof)
   */
  protected getChallenge = (): Buffer => {
    return this.proof.subarray(0, 24);
  };

  /**
   * Extracts the main proof part (without the challenge)
   *
   * This method extracts the 32 bytes after the challenge (from byte 24 onwards)
   * as the main part of the proof. In the Schnorr protocol, this is the response to the challenge.
   *
   * @returns Buffer containing the main proof part (32 bytes after the challenge)
   */
  protected getChallengeProof = (): Buffer => {
    return this.proof.subarray(24);
  };

  /**
   * Verifies the Schnorr proof against the commitment using the provided public key
   *
   * Uses the Schnorr equation: g^s * X^(n-e) = R
   * where g=base point, s=proof, X=public key, e=challenge, n=curve order, R=commitment
   *
   * @param publicKeyHex - The hex-encoded public key to verify against
   * @returns true if the proof is valid, false otherwise
   */
  verify = (publicKeyHex: string): boolean => {
    if (!this.hasProof() || this.type === MultiSigDataHintType.SIMULATED) {
      return false;
    }

    try {
      // Get challenge and proof buffers
      const challengeBuffer = this.getChallenge();
      const proofBuffer = this.getChallengeProof();

      // Convert to hex format for BigInt conversion
      const challengeHex = '0x' + challengeBuffer.toString('hex');
      const proofHex = '0x' + proofBuffer.toString('hex');

      // Convert to BigInt
      const challengeBigInt = BigInt(challengeHex);
      const proofBigInt = BigInt(proofHex);

      // Verify using secp256k1 curve
      // X = public key point, g = base point, e = challenge, s = proof
      // Verification equation: g^s * X^(n-e) = R
      try {
        // Create point from public key
        const publicKeyPoint = secp256k1.ProjectivePoint.fromHex(publicKeyHex);

        // R = g^s
        const baseTimesProof =
          secp256k1.ProjectivePoint.BASE.multiply(proofBigInt);

        // e' = n - e (n is the curve order)
        const curveOrder = secp256k1.CURVE.n;
        const negatedChallenge = curveOrder - challengeBigInt;

        // X^e'
        const publicKeyTimesNegChallenge =
          publicKeyPoint.multiply(negatedChallenge);

        // g^s * X^e'
        const calculatedCommitment = baseTimesProof.add(
          publicKeyTimesNegChallenge,
        );

        // Convert to bytes for comparison
        const calculatedCommitmentBytes = calculatedCommitment.toRawBytes();

        // Compare with the actual commitment
        return Buffer.compare(calculatedCommitmentBytes, this.commit) === 0;
      } catch (error) {
        console.error('Error during Schnorr verification:', error);
        return false;
      }
    } catch (error) {
      console.error('Error processing proof data:', error);
      return false;
    }
  };

  /**
   * Updates the current hint's data from the provided transaction hint bag
   *
   * This method extracts relevant hints from the transaction hint bag based on the
   * hint's inputIndex and publicKeyIndex, and updates the commit, proof, and secret values.
   *
   * @param txHintBag - The transaction hint bag containing public and secret hints
   * @returns boolean - True if any values were changed, false otherwise
   */
  fill = (txHintBag: TxHintBag) => {
    let changed = false;
    if (
      Object.prototype.hasOwnProperty.call(
        txHintBag.secretHints,
        this.inputIndex,
      )
    ) {
      const secretsForInput = txHintBag.secretHints[this.inputIndex.toString()];
      const filtered = secretsForInput.filter((item) =>
        item.position.endsWith('-' + this.publicKeyIndex),
      );
      const proof = filtered.reduce(
        (reduced, hintItem) => (reduced === '' ? hintItem.proof : reduced),
        '',
      );
      const isSimulated =
        filtered.filter((hintItem) =>
          hintItem.hint.toLowerCase().includes('simulated'),
        ).length > 0;
      if (proof !== this.proof.toString('hex') && proof !== '') {
        this.proof = Buffer.from(proof, 'hex');
        changed = true;
      }
      if (isSimulated && this.type === MultiSigDataHintType.REAL) {
        this.type = MultiSigDataHintType.SIMULATED;
        changed = true;
      }
    }
    if (
      Object.prototype.hasOwnProperty.call(
        txHintBag.publicHints,
        this.inputIndex,
      )
    ) {
      const publicForInput = txHintBag.publicHints[this.inputIndex.toString()];
      const filtered = publicForInput.filter((item) =>
        item.position.endsWith('-' + this.publicKeyIndex),
      );
      const commit = filtered.reduce(
        (reduced, hintItem) => (reduced === '' ? hintItem.a : reduced),
        '',
      );
      const secret = filtered.reduce(
        (reduced, hintItem) =>
          reduced === '' ? (hintItem.secret ?? '') : reduced,
        '',
      );
      if (commit !== this.commit.toString('hex') && commit !== '') {
        this.commit = Buffer.from(commit, 'hex');
        changed = true;
      }
      if (secret !== this.secret.toString('hex') && secret !== '') {
        this.secret = Buffer.from(secret, 'hex');
        changed = true;
      }
    }
    return changed;
  };

  /**
   * Updates this hint's properties with values from another hint if current values are empty
   *
   * This method selectively copies properties from the provided hint to this hint,
   * but only for properties that are empty in the current instance:
   * - commit: copied if current commit is empty
   * - proof: copied if current proof is empty
   * - secret: copied if current secret is empty
   * - type: copied if current type is REAL (allowing override to SIMULATED)
   *
   * @param other - The MultiSigDataHint instance to copy values from
   */
  override = (other: MultiSigDataHint) => {
    if (this.commit.length === 0) this.commit = other.commit;
    if (this.proof.length === 0) this.proof = other.proof;
    if (this.secret.length === 0) this.secret = other.secret;
    if (this.type === MultiSigDataHintType.REAL) this.type = other.type;
  };

  generatePublicHint = (
    inputPublicKeys: Array<Array<string>>,
  ): Array<TxSinglePublicHint> => {
    if (this.commit.length === 0) return [];
    const pkJson = {
      op: '205',
      h: inputPublicKeys[this.inputIndex][this.publicKeyIndex],
    };
    const res: Array<TxSinglePublicHint> = [
      {
        hint:
          this.type === MultiSigDataHintType.REAL ? 'cmtReal' : 'cmtSimulated',
        pubkey: { ...pkJson },
        type: 'dlog',
        a: this.commit.toString('hex'),
        position: `0-${this.publicKeyIndex}`,
      },
    ];
    if (this.secret.length > 0) {
      res.push({
        hint: 'cmtWithSecret',
        pubkey: { ...pkJson },
        type: 'dlog',
        a: this.commit.toString('hex'),
        position: `0-${this.publicKeyIndex}`,
        secret: this.secret.toString('hex'),
      });
    }
    return res;
  };

  generateSecretHint = (
    inputPublicKeys: Array<Array<string>>,
  ): Array<TxSingleSecretHint> => {
    if (this.proof.length === 0) return [];
    const pkJson = {
      op: '205',
      h: inputPublicKeys[this.inputIndex][this.publicKeyIndex],
    };
    return [
      {
        hint:
          this.type === MultiSigDataHintType.REAL
            ? 'proofReal'
            : 'proofSimulated',
        pubkey: { ...pkJson },
        challenge: this.getChallenge().toString('hex'),
        position: `0-${this.publicKeyIndex}`,
        proof: this.proof.toString('hex'),
      },
    ];
  };
}
