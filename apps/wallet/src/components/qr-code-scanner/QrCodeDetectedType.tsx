import React, { useEffect, useState } from 'react';
import QrCodeTypes from './qrcode-types/types';
import { QrCodeType } from '@/types/qrcode';
import { useSelector } from 'react-redux';
import { GlobalStateType } from '@/store';
import TxSignContextHandler from '../sign/context/TxSignContextHandler';
import { StateWallet } from '@/store/reducer/wallet';
import { SelectableWalletContext } from '../sign/context/SelectableWalletContext';
import useChunks from '@/hooks/useChunks';
import MorePages from './qrcode-types/more-pages/MorePages';
import Loading from '../state-message/Loading';

interface QrCodeDetectedTypePropsType {
  scanned: string;
  children: React.ReactNode;
  open: boolean;
  scanning: boolean;
  callback?: (scanned: string) => unknown;
  close: () => unknown;
}

const QrCodeDetectedType = (props: QrCodeDetectedTypePropsType) => {
  const [selectedType, setSelectedType] = useState<QrCodeType | undefined>();
  const [checked, setChecked] = useState('');
  const [checking, setChecking] = useState(false);
  const chunks = useChunks(
    props.scanned,
    selectedType ? selectedType.type : undefined,
  );
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
    if (!props.open) {
      if (selectedType) {
        setSelectedType(undefined);
      }
    }
  }, [props.open, selectedType]);
  useEffect(() => {
    if (props.open && !props.scanning && chunks.last === props.scanned) {
      if (
        !chunks.loading &&
        !chunks.displayChunks &&
        props.callback &&
        (selectedType === undefined || selectedType.render === undefined)
      ) {
        props.callback(chunks.data);
      }
    }
  });
  useEffect(() => {
    if (props.scanned !== checked && !checking) {
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
  return (
    <React.Fragment>
      <div
        style={{ display: props.open && !props.scanning ? 'block' : 'none' }}
      >
        {checking || chunks.loading ? (
          <Loading />
        ) : chunks.displayChunks ? (
          <MorePages
            error={chunks.error}
            type={selectedType?.type}
            completed={chunks.completedChunks}
            total={chunks.totalPages}
            close={props.close}
          />
        ) : usedWallet && selectedType !== undefined && selectedType.render ? (
          <SelectableWalletContext.Provider
            value={{ setWallet: storeWallet, wallet: usedWallet }}
          >
            <TxSignContextHandler
              denySubmit={true}
              wallet={usedWallet}
              close={props.close}
            >
              {selectedType.render(chunks.data, props.close)}
            </TxSignContextHandler>
          </SelectableWalletContext.Provider>
        ) : null}
      </div>
      <div style={{ display: props.open ? 'none' : 'block' }}>
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default QrCodeDetectedType;
