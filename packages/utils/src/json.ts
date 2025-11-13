import JSONBigInt from 'json-bigint';

const JsonBI = JSONBigInt({ useNativeBigInt: true });
const JsonAllBI = JSONBigInt({
  useNativeBigInt: true,
  alwaysParseAsBig: true,
});

export { JsonBI, JsonAllBI };
