import { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  GlobalStateType,
  ImportProcessingState,
  QrCodeTypeEnum,
  RestoreWalletWithSelection,
} from '@minotaur-ergo/types';

import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';

const useImportProcess = () => {
  const [data, setData] = useState<Array<RestoreWalletWithSelection>>([]);
  const [loading, setLoading] = useState(false);
  const qrCodeContext = useContext(QrCodeContext);
  // TODO must use all wallets not only filtered wallets
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  const process = useCallback(
    (importedData: string) => {
      setLoading(true);
      try {
        const dataJson = JSON.parse(importedData);
        if (
          Object.prototype.hasOwnProperty.call(
            dataJson,
            QrCodeTypeEnum.WalletExportJSON,
          )
        ) {
          const walletsArray = JSON.parse(
            dataJson[QrCodeTypeEnum.WalletExportJSON],
          ) as Array<RestoreWalletWithSelection>;
          setData(
            walletsArray.map((item): RestoreWalletWithSelection => {
              const exists = wallets.some((wallet) =>
                wallet.addresses
                  .map((item) => item.address)
                  .some((address) => item.addresses?.includes(address)),
              );
              return {
                ...item,
                selected: false,
                invalid: exists ? 'is duplicate!' : undefined,
                status: ImportProcessingState.Pending,
              };
            }),
          );
        } else {
          console.log('invalid data');
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    },
    [wallets],
  );
  const scan = useCallback(() => {
    qrCodeContext
      .start()
      .then(process)
      .catch((reason) => console.log(reason));
  }, [qrCodeContext, process]);
  return {
    data,
    scan,
    loading,
    setData,
  };
};

export default useImportProcess;
