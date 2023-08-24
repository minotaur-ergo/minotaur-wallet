import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReadOnlySend from './ReadOnlySend';
import NormalSend from './NormalSend';

const Send = () => {
  const [searchParams] = useSearchParams();
  const isReadOnlyWallet = useMemo(
    () => searchParams.get('readOnly') === 'true',
    []
  );

  if (isReadOnlyWallet) return <ReadOnlySend />;
  return <NormalSend />;
};

export default Send;
