import { ImportProcessingState, RestoreWalletWithSelection } from './state';

export interface ImportWalletContextType {
  data: Array<RestoreWalletWithSelection>;
  scan: () => unknown;
  start: () => unknown;
  selected: number;
  status: ImportProcessingState;
  handleSelection: (index: number) => unknown;
}
