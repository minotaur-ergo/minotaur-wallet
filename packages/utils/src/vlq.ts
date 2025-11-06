const abs = (value: number) => (value < 0 ? -value : value);

const int8Vlq = (value: number) => {
  const sign = value > 0 ? 0n : 1n;
  const valueBigInt = BigInt(abs(value)) * 2n + sign;
  return uInt8Vlq(valueBigInt);
};

const uInt8Vlq = (value: number | bigint) => {
  const res: Array<number> = [];
  let valueBigInt = BigInt(value);
  while (valueBigInt > 0) {
    if (valueBigInt < 128n) {
      res.push(Number(valueBigInt));
      break;
    } else {
      res.push(Number(valueBigInt % 128n) + 128);
      valueBigInt = valueBigInt / 128n;
    }
  }
  return Buffer.from(Uint8Array.from(res)).toString('hex');
};

export { int8Vlq, uInt8Vlq };
