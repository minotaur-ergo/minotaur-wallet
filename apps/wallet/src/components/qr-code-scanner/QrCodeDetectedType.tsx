import LoadingPage from '@/components/loading-page/LoadingPage';
import { useEffect, useState } from 'react';
import QrCodeTypes from './qrcode-types/types';
import { QrCodeType } from '@/types/qrcode';
import { useSelector } from 'react-redux';
import { GlobalStateType } from '@/store';
import TxSignContextHandler from '../sign/context/TxSignContextHandler';
import { StateWallet } from '@/store/reducer/wallet';
import { SelectableWalletContext } from '../sign/context/SelectableWalletContext';

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
      console.log('start process detected type');
      setChecking(true);
      const selectedTypes = QrCodeTypes.filter((item) =>
        item.detect(props.scanned),
      );
      setSelectedType(selectedTypes.length > 0 ? selectedTypes[0] : undefined);
      if (selectedTypes.length == 0 && props.callback) {
        props.callback(props.scanned);
      }
      setChecked(props.scanned);
      setChecking(false);
    }
  }, [checked, checking, props]);
  const usedWallet = wallet === undefined ? firstWallet : wallet;
  console.log(selectedType, usedWallet);
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
          {selectedType.render(props.scanned, props.close)}
        </TxSignContextHandler>
      </SelectableWalletContext.Provider>
    );
  }
};

export default QrCodeDetectedType;
