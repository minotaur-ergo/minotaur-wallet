import { useEffect, useState } from 'react';

import { DAppPropsType } from '@minotaur-ergo/types';

const useAddresses = (props: DAppPropsType) => {
  const [addresses, setAddresses] = useState<Array<string>>([]);
  const [loadState, setLoadState] = useState<{
    wallet: number;
    loading: boolean;
  }>({
    wallet: -1,
    loading: false,
  });
  useEffect(() => {
    if (!loadState.loading && loadState.wallet !== props.walletId) {
      setLoadState({ loading: true, wallet: loadState.wallet });
      const wallet = props.walletId;
      props.getAddresses().then((res) => {
        setAddresses(res);
        setLoadState({ loading: false, wallet: wallet });
      });
    }
  }, [loadState, props]);
  return {
    addresses,
    loading: loadState.loading,
  };
};

export default useAddresses;
