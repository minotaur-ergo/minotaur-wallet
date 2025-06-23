import MultiSigContextHandler from '@/components/sign/context/MultiSigContextHandler';
import { StateWallet } from '@minotaur-ergo/types';
import MultiSigTransaction from './MultiSigTransaction';
import MultiSigDataContextHandler from '@/components/sign/context/MultiSigDataContextHandler';
import TxSubmitContextHandler from '@/components/sign/context/TxSubmitContextHandler';

interface MultiSigTransactionPagePropsType {
  wallet: StateWallet;
}

const MultiSigTransactionPage = (props: MultiSigTransactionPagePropsType) => {
  return (
    <MultiSigContextHandler wallet={props.wallet}>
      <MultiSigDataContextHandler wallet={props.wallet}>
        <TxSubmitContextHandler wallet={props.wallet}>
          <MultiSigTransaction wallet={props.wallet} />
        </TxSubmitContextHandler>
      </MultiSigDataContextHandler>
    </MultiSigContextHandler>
  );
};

export default MultiSigTransactionPage;
