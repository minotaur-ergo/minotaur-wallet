import { TxHintBag } from '@/types/multi-sig/tx';
import { secp256k1 } from '@noble/curves/secp256k1';
import { Buffer } from 'buffer';

export enum MultiSigDataHintType {
  SIMULATED = 'simulated',
  REAL = 'real',
}

export class MultiSigDataHint {
  constructor(
    public inputIndex: number,
    public publicKeyIndex: number,
    public commit: string = '',
    public proof: string = '',
    public secret: string = '',
    public type: MultiSigDataHintType = MultiSigDataHintType.REAL,
  ) {}

  /**
   * Creates a deep copy of the current MultiSigDataHint instance
   *
   * @returns A new MultiSigDataHint object with the same property values
   */
  clone(): MultiSigDataHint {
    return new MultiSigDataHint(
      this.inputIndex,
      this.publicKeyIndex,
      this.commit,
      this.proof,
      this.secret,
      this.type,
    );
  }

  // Check equality of two hints based on commit and type
  equals = (other: MultiSigDataHint): boolean =>
    this.commit === other.commit && this.type === other.type;

  // Convert hint to base64 string
  serialize = (): string => {
    // If there's no proof, return only the commit
    if (!this.proof) return this.commit;

    const commitBytes = Buffer.from(this.commit, 'base64');
    const isSimulated = this.type === MultiSigDataHintType.SIMULATED;

    // Calculate buffer size based on what we're including
    const bufferSize = 33 + 56 + (isSimulated ? 1 : 0); // commit + proof + (type indicator only for SIMULATED)
    const buffer = Buffer.alloc(bufferSize);

    // Copy commit bytes to buffer
    commitBytes.copy(buffer, 0);

    // Convert and copy proof bytes
    const proofBytes = Buffer.from(this.proof, 'base64');
    proofBytes.copy(buffer, 33);

    // Set type indicator byte (only for SIMULATED)
    isSimulated && (buffer[33 + 56] = 1);

    // Convert buffer to base64
    return buffer.toString('base64');
  };

  // Create a MultiSigDataHint instance from a base64 string
  static deserialize = (
    hintBase64: string,
    inputIndex: number,
    signerIndex: number,
  ): MultiSigDataHint => {
    // Decode base64 string to bytes
    const bytes = Buffer.from(hintBase64, 'base64');

    // Extract commit (first 33 bytes)
    const commit = Buffer.from(bytes.subarray(0, 33)).toString('base64');

    // Extract proof and type with conditional operators
    const proof =
      bytes.length > 33
        ? Buffer.from(bytes.subarray(33, 33 + 56)).toString('base64')
        : '';
    const type =
      bytes.length > 33 + 56 && bytes[33 + 56] === 1
        ? MultiSigDataHintType.SIMULATED
        : MultiSigDataHintType.REAL;

    return new MultiSigDataHint(
      inputIndex,
      signerIndex,
      commit,
      proof,
      '',
      type,
    );
  };

  // Check if hint contains a proof
  hasProof = (): boolean => this.proof.length > 0;

  // Get the challenge part (first 24 bytes) of the proof as a Buffer
  protected getChallenge = (): Buffer => {
    const proofBytes = Buffer.from(this.proof, 'base64');
    return proofBytes.subarray(0, 24);
  };

  // Get the actual proof part (next 32 bytes after challenge) of the proof as a Buffer
  protected getChallengeProof = (): Buffer => {
    const proofBytes = Buffer.from(this.proof, 'base64');
    return proofBytes.subarray(24);
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

      // Get commitment bytes
      const commitBytes = Buffer.from(this.commit, 'base64');

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
        return Buffer.compare(calculatedCommitmentBytes, commitBytes) === 0;
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
      const proof = secretsForInput
        .filter((item) => item.position.endsWith('-' + this.publicKeyIndex))
        .reduce((a, b) => (a === '' ? a : b.proof), '');
      if (proof !== this.proof && proof !== '') {
        this.proof = proof;
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
      const commit = filtered.reduce((a, b) => (a === '' ? a : b.a), '');
      const secret = filtered.reduce(
        (a, b) => (a === '' ? a : (b.secret ?? '')),
        '',
      );
      if (commit !== this.commit && commit !== '') {
        this.commit = commit;
        changed = true;
      }
      if (secret !== this.secret && secret !== '') {
        this.secret = secret;
        changed = true;
      }
    }
    return changed;
  };
}
