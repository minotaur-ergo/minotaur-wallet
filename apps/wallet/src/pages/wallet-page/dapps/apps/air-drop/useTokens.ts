import {
  IMPL_FEE,
  TX_FEE,
} from '@/pages/wallet-page/dapps/apps/air-drop/params';
import { AssetInfo, DAppPropsType } from '@/types/dapps';
import { useEffect, useState } from 'react';

const useTokens = (props: DAppPropsType) => {
  const [totalErg, setTotalErg] = useState(0n);
  const [tokens, setTokens] = useState<Array<AssetInfo>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      props.getAssets().then((tokens) => {
        props.getTokenAmount().then((res) => {
          setLoaded(true);
          setTotalErg(res - TX_FEE - IMPL_FEE);
        });
        setTokens(tokens);
      });
    }
  });
  return {
    tokens,
    totalErg,
  };
};

export default useTokens;
