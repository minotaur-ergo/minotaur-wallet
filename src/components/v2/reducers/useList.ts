import { useEffect, useState } from 'react';

interface ErrorType {
  title: string;
  description?: string;
}

export default function useList(
  getData: (offset: number) => Promise<Array<any>>
) {
  const [data, setData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorType>({} as ErrorType);

  function handleGetData() {
    setIsLoading(true);
    const offset = data.length;
    getData(offset)
      .then((newData) => {
        setData(newData);
      })
      .catch((errors) => {
        setError(errors[0]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    handleGetData();
  }, []);

  return {
    data,
    isLoading,
    error,
    hasError: Boolean(error.title),
    handleGetData,
  };
}
