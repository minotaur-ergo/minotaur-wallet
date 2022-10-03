export const TxSignR = 'CSR';
export const TxPublishR = 'CSTX';
export const ErgoPayR = 'ergopay';

const types = [TxSignR, TxPublishR, ErgoPayR];
export const detectType = (name: string): string => {
  if (types.indexOf(name) >= 0) {
    return name;
  }
  return '';
};
