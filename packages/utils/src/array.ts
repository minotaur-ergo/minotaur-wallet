export const createEmptyArray = <T>(
  length: number,
  defaultValue: T,
): Array<T> => {
  const res: Array<T> = [];
  for (let index = 0; index < length; index++) {
    res.push(defaultValue);
  }
  return res;
};

export const createEmptyArrayWithIndex = (length: number): Array<number> => {
  const res: Array<number> = [];
  for (let index = 0; index < length; index++) {
    res.push(index);
  }
  return res;
};

export const iterateIndexes = (length: number) => {
  return {
    forEach: (callback: (index: number) => unknown) => {
      for (let index = 0; index < length; index++) {
        callback(index);
      }
    },
  };
};
