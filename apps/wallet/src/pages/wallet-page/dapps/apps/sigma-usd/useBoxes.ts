import { useEffect, useState } from 'react';

import { ChainTypeInterface } from '@minotaur-ergo/types';

import Bank from './Bank';
import Oracle from './Oracle';

const useBoxes = (chain: ChainTypeInterface) => {
  const [loading, setLoading] = useState(false);
  const [boxesLoading, setBoxesLoading] = useState(false);
  const [bank, setBank] = useState<Bank | undefined>();
  const [height, setHeight] = useState(0);
  const [proceedHeight, setProceedHeight] = useState(0);
  const [oracle, setOracle] = useState<Oracle | undefined>();
  const scheduleToRefresh = (
    time: 'long' | 'short',
    callback: () => unknown,
  ) => {
    const timeout = time === 'long' ? 2 * 60 * 1000 : 30 * 1000;
    setTimeout(callback, timeout);
  };

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      chain
        .getNetwork()
        .getHeight()
        .then((height) => {
          setHeight(height);
          scheduleToRefresh('long', () => setLoading(false));
        })
        .catch(() => scheduleToRefresh('short', () => setLoading(false)));
    }
  }, [loading, chain]);
  useEffect(() => {
    const process = async () => {
      const network = chain.getNetwork();
      const currentHeight = height;
      setBoxesLoading(true);
      const bankBoxes = await network.getUnspentBoxByTokenId(
        Bank.NFT_TOKEN_ID,
        0,
        1,
      );
      const oracleBoxes = await network.getUnspentBoxByTokenId(
        Oracle.TOKEN_ID,
        0,
        1,
      );
      const newOracle = new Oracle(await network.trackMempool(oracleBoxes[0]));
      const newBank = new Bank(
        await network.trackMempool(bankBoxes[0]),
        newOracle,
      );
      setBank(newBank);
      setOracle(newOracle);
      setProceedHeight(currentHeight);
      setBoxesLoading(false);
    };
    if (height > proceedHeight && !boxesLoading) {
      process();
    }
  }, [chain, boxesLoading, height, proceedHeight]);
  return {
    oracle,
    bank,
  };
};

export default useBoxes;
