import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType, QrCodeType, StateWallet } from '@minotaur-ergo/types';

import LoadingPage from '@/components/loading-page/LoadingPage';

import { SelectableWalletContext } from '../sign/context/SelectableWalletContext';
import TxSignContextHandler from '../sign/context/TxSignContextHandler';
import QrCodeTypes from './qrcode-types/types';

interface QrCodeDetectedTypePropsType {
  scanned: string;
  open: boolean;
  scanning: boolean;
  callback?: (scanned: string) => unknown;
  close: () => unknown;
}

const QrCodeDetectedType = (props: QrCodeDetectedTypePropsType) => {
  const [selectedType, setSelectedType] = useState<QrCodeType | undefined>();
  const [checked, setChecked] = useState('');
  const [data, setData] = useState('');
  const [checking, setChecking] = useState(false);
  const firstWallet = useSelector(
    (state: GlobalStateType) => state.wallet.wallets[0],
  );
  const [wallet, setWallet] = useState<StateWallet | undefined>();
  const storeWallet = (newWallet: StateWallet) => {
    if (wallet === undefined || wallet.id !== newWallet.id) {
      setWallet(newWallet);
    }
  };
  useEffect(() => {
    if (props.scanned !== checked && !checking) {
      console.debug('start process detected type');
      setChecking(true);
      const selectedTypes = QrCodeTypes.filter((item) =>
        item.detect(props.scanned),
      );
      setSelectedType(selectedTypes.length > 0 ? selectedTypes[0] : undefined);
      setData(
        selectedTypes.length > 0
          ? (selectedTypes[0].detect(props.scanned) ?? '')
          : '',
      );
      if (
        (selectedTypes.length == 0 || selectedTypes[0].render === undefined) &&
        props.callback
      ) {
        props.callback(props.scanned);
      }
      setChecked(props.scanned);
      setChecking(false);
    }
  }, [checked, checking, props]);
  const usedWallet = wallet === undefined ? firstWallet : wallet;
  if (checking) {
    return <LoadingPage />;
  }
  if (usedWallet && selectedType !== undefined && selectedType.render) {
    return (
      <SelectableWalletContext.Provider
        value={{ setWallet: storeWallet, wallet: usedWallet }}
      >
        <TxSignContextHandler
          denySubmit={true}
          wallet={usedWallet}
          close={props.close}
        >
          {selectedType.render(data, props.close)}
        </TxSignContextHandler>
      </SelectableWalletContext.Provider>
    );
  }
};

export default QrCodeDetectedType;
