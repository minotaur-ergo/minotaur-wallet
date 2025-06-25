export const commaSeparate = (amount: string, fromEnd: boolean = true) => {
  const processingAmount = fromEnd
    ? amount.split('').reverse().join('')
    : amount;
  const chunks = processingAmount.match(/.{1,3}/g);
  const res = (chunks ?? []).join(',');
  return fromEnd ? res.split('').reverse().join('') : res;
};

export const dottedText = (text: string, paddingSize: number) => {
  const dotStart = text.substring(0, paddingSize);
  const dottedEnd = text.substring(text.length - paddingSize);
  const dotted =
    text.length > 2 * paddingSize ? dotStart + '...' + dottedEnd : text;
  return dotted;
};

export const sliceToChunksString = (arr: string, chunkSize: number) => {
  const res: Array<string> = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

export const getValueColor = (value: bigint) =>
  value > 0 ? 'success.main' : 'error.main';
