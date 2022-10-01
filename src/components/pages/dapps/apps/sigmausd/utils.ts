export const format_usd = (amount: bigint): string => {
  return (
    (amount / BigInt(100)).toString() +
    '.' +
    (amount % BigInt(100)).toString().padStart(2, '0')
  );
};
