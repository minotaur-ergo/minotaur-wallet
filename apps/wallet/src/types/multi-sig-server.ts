import { TransactionHintBagType } from '@/types/multi-sig';

interface RegisteredXPub {
  xpub: string;
  registered: boolean;
}

interface RegisteredTeam {
  name: string;
  id: string;
  m: number;
  xpubs: Array<RegisteredXPub>;
  address: string;
}

interface ReducedTxList {
  id: string;
  reduced: string;
  boxes: Array<string>;
  committed: number;
  signed: number;
}

interface ReducedTx {
  id: string;
  reduced: string;
  boxes: Array<string>;
  dataInputs: Array<string>;
}

interface TxCommitmentResponse {
  collected: number;
  commitments: TransactionHintBagType;
  committed: Array<string>;
  enoughCollected: boolean;
  userCommitted: boolean;
  provers: Array<string>;
}

export type { RegisteredTeam, RegisteredXPub, ReducedTxList, ReducedTx,TxCommitmentResponse };
