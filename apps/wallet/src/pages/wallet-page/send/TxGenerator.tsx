import { useContext, useEffect, useState } from 'react';

import { StateWallet } from '@minotaur-ergo/types';
import { JsonBI } from '@minotaur-ergo/utils';

import { generateTx } from '@/action/tx';
import TxGenerateContext from '@/components/sign/context/TxGenerateContext';
import TxSignContext from '@/components/sign/context/TxSignContext';
import { FEE } from '@/utils/const';

interface TxGeneratorPropsType {
  wallet: StateWallet;
}
const TxGenerator = (props: TxGeneratorPropsType) => {
  const [loading, setLoading] = useState(false);
  const [proceed, setProceed] = useState('');
  const generatorContext = useContext(TxGenerateContext);
  const signerContext = useContext(TxSignContext);
  useEffect(() => {
    if (!loading && generatorContext.ready) {
      const newProceed = JsonBI.stringify({
        addresses: generatorContext.selectedAddresses,
        receivers: generatorContext.receivers,
      });
      if (proceed !== newProceed) {
        setLoading(true);
        generatorContext.setError(null);
        signerContext.setTx(undefined, [], []);
        const usedAddresses =
          generatorContext.selectedAddresses === 'all'
            ? props.wallet.addresses.map((item) => item.id)
            : generatorContext.selectedAddresses.map((item) => parseInt(item));
        generateTx(props.wallet, usedAddresses, generatorContext.receivers, FEE)
          .then((res) => {
            signerContext.setTx(res.tx, res.boxes, []);
            setProceed(newProceed);
            setLoading(false);
            generatorContext.setError(null);
          })
          .catch((e) => {
            console.log(e);
            signerContext.setTx(undefined, [], []);
            setProceed(newProceed);
            setLoading(false);
            generatorContext.setError(String(e));
          });
      }
    }
  }, [
    loading,
    generatorContext.selectedAddresses,
    generatorContext.receivers,
    proceed,
    props.wallet,
    signerContext,
    generatorContext.ready,
    generatorContext,
  ]);
  return null;
};

export default TxGenerator;
