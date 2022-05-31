import JSONBigInt from "json-bigint"

export const JsonBI = JSONBigInt({useNativeBigInt: true})
export const JsonAllBI = JSONBigInt({useNativeBigInt: true, alwaysParseAsBig: true})
