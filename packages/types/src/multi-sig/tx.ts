export interface TxHintPublicKey {
  op: string;
  h: string;
}

export interface TxSingleSecretHint {
  hint: string;
  challenge: string;
  position: string;
  proof: string;
  pubkey: TxHintPublicKey;
}

export interface TxSinglePublicHint {
  hint: string;
  secret?: string;
  pubkey: TxHintPublicKey;
  type: string;
  a: string;
  position: string;
}

export interface TxPublicHint {
  [key: string]: Array<TxSinglePublicHint>;
}

export interface TxSecretHint {
  [key: string]: Array<TxSingleSecretHint>;
}

export interface TxHintBag {
  publicHints: TxPublicHint;
  secretHints: TxSecretHint;
}
