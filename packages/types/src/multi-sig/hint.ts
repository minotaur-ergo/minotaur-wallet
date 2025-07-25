import { TxHintBag, TxSinglePublicHint, TxSingleSecretHint } from './tx';

export enum MultiSigHintType {
  Simulated = 'SIMULATED',
  Real = 'REAL',
}

export abstract class MultiSigDataHint {
  abstract get Type(): MultiSigHintType;

  abstract get Commit(): string;

  abstract get Proof(): string;

  abstract get Secret(): string;

  abstract clone: () => MultiSigDataHint;

  equals = (other: MultiSigDataHint): boolean =>
    this.Commit === other.Commit && this.Type === other.Type;

  abstract serialize: () => string;

  /**
   * Checks if this hint contains a proof
   *
   * This method simply checks the length of the proof string to determine if data exists.
   *
   * @returns true if proof exists, false otherwise
   */
  hasProof = (): boolean => this.Proof.length > 0;

  abstract verify: (publicKeyHex: string) => boolean;

  abstract fill: (txHintBag: TxHintBag) => boolean;

  abstract override: (other: MultiSigDataHint) => void;

  abstract generatePublicHint: (
    inputPublicKeys: Array<Array<string>>,
    password?: string,
  ) => Array<TxSinglePublicHint>;

  abstract generateSecretHint: (
    inputPublicKeys: Array<Array<string>>,
  ) => Array<TxSingleSecretHint>;
}
