import { DAppPropsType } from '@/types/dapps';
import { useEffect, useState } from 'react';

const useAddresses = (props: DAppPropsType) => {
  const [addresses, setAddresses] = useState<Array<string>>([]);
  const [loading, setLoading] = useState<{ wallet: number; loading: boolean }>({
    wallet: -1,
    loading: false,
  });
  useEffect(() => {
    if (!loading.loading && loading.wallet !== props.walletId) {
      setLoading({ loading: true, wallet: loading.wallet });
      const wallet = props.walletId;
      props.getAddresses().then((res) => {
        setAddresses(res);
        setLoading({ loading: false, wallet: wallet });
      });
    }
  }, [loading, props]);
  return addresses;
};

export default useAddresses;
