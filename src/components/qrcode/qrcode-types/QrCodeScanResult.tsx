export const TxSignR: string = 'CSR';
export const TxPublishR: string = 'CSTX';
export const ErgoPayR: string = 'ergopay';

const types = [TxSignR, TxPublishR, ErgoPayR];
export const detectType = (name: string): string => {
  if (types.indexOf(name) >= 0) {
    return name;
  }
  return '';
};
