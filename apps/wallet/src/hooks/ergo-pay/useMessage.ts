import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  ErgoPaySeverityEnum,
  GlobalStateType,
  MessageResponseType,
  MultiAddressSupportedEnum,
  StateAddress,
  StateWallet,
} from '@minotaur-ergo/types';
import * as wasm from 'ergo-lib-wasm-browser';

import { SelectableWalletContext } from '@/components/sign/context/SelectableWalletContext';
import TxSignContext from '@/components/sign/context/TxSignContext';
import { fetchBoxesFromNetwork, getInternalBoxes } from '@/utils/ergopay';
import { createEmptyArrayWithIndex } from '@/utils/functions';

import useErgoPayData from './useErgoPayData';
import useMultiAddressSupported from './useMultiAddressSupported';

const getErgoPaySeverity = (severity?: ErgoPaySeverityEnum) => {
  switch (severity) {
    case ErgoPaySeverityEnum.Info:
      return 'info';
    case ErgoPaySeverityEnum.Error:
      return 'error';
    case ErgoPaySeverityEnum.Warn:
      return 'warn';
  }
  return 'default';
};

const useMessage = (
  link: string,
  tryCount: number,
  startLoad: boolean,
  wallet?: StateWallet,
  addresses?: Array<StateAddress>,
): MessageResponseType => {
  const multiple = useMultiAddressSupported(link, tryCount);
  const ergoPayData = useErgoPayData(
    link,
    multiple.supported,
    addresses ? addresses.map((item) => item.address) : [],
    startLoad,
    tryCount,
  );
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  const [allowedWallets, setAllowedWallets] = useState<Array<StateWallet>>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadedTx, setLoadedTx] = useState('');
  const context = useContext(TxSignContext);
  const walletContext = useContext(SelectableWalletContext);
  useEffect(() => {
    if (
      ergoPayData.reducedTx &&
      !loading &&
      loadedTx !== (ergoPayData.reducedTx ?? '')
    ) {
      setLoading(true);
      const loadingReduced = ergoPayData.reducedTx;
      const ergoPayTx = wasm.ReducedTransaction.sigma_parse_bytes(
        Buffer.from(loadingReduced, 'base64'),
      );
      const unsigned = ergoPayTx.unsigned_tx();
      const inputs = unsigned.inputs();
      const boxIds = createEmptyArrayWithIndex(inputs.len()).map((index) =>
        inputs.get(index).box_id().to_str(),
      );
      getInternalBoxes(boxIds).then((boxes) => {
        if (
          Object.keys(boxes).length === 0 ||
          (wallet &&
            !Object.prototype.hasOwnProperty.call(boxes, `${wallet.id}`))
        ) {
          setError('This transaction does not belong to this wallet');
        } else if (wallet || Object.keys(boxes).length === 1) {
          const walletId = wallet ? `${wallet.id}` : Object.keys(boxes)[0];
          const foundedWallet = wallets.filter(
            (item) => `${item.id}` === walletId,
          );
          if (foundedWallet.length === 0) {
            setError('Internal error. wallet not found');
            setLoadedTx(ergoPayData.reducedTx ?? '');
            setLoading(false);
          } else {
            fetchBoxesFromNetwork(
              boxIds,
              boxes[walletId],
              foundedWallet[0],
            ).then((allBoxes) => {
              setAllowedWallets(foundedWallet);
              context.setReducedTx(ergoPayTx);
              context.setTx(unsigned, allBoxes);
              setLoadedTx(ergoPayData.reducedTx ?? '');
              setLoading(false);
            });
          }
        } else {
          setAllowedWallets(
            wallets.filter((item) => Object.keys(boxes).includes(`${item.id}`)),
          );
        }
      });
    }
  }, [ergoPayData, loadedTx, loading, wallet, wallets, context]);
  useEffect(() => {
    if (wallet) {
      walletContext.setWallet(wallet);
    } else if (allowedWallets.length === 1) {
      walletContext.setWallet(allowedWallets[0]);
    }
  });
  // TODO must add loading state title and description
  const getDescription = (): Array<string> => {
    if (multiple.description.length > 0) return multiple.description;
    if (ergoPayData.message) return ergoPayData.message.split('\n');
    if (error) return [error];
    if (getLoading()) return ['Please wait'];
    return [];
  };
  const getTitle = () => {
    if (multiple.supported === MultiAddressSupportedEnum.NOT_CHECKED)
      return 'Checking Multiple Address Supported';
    if (ergoPayData.loading) return 'Loading ErgoPay data';
    if (multiple.title) return multiple.title;
    return '';
  };
  const getFailed = (): boolean => {
    return (
      ergoPayData.failed ||
      multiple.severity === MultiAddressSupportedEnum.FAILED
    );
  };
  const getLoading = (): boolean => {
    if (
      multiple.supported === MultiAddressSupportedEnum.NOT_CHECKED ||
      ergoPayData.loading
    )
      return true;
    return false;
  };
  const getSeverity = () => {
    if (ergoPayData.messageSeverity)
      return getErgoPaySeverity(ergoPayData.messageSeverity);
    if (multiple.severity) return multiple.severity;
    return '';
  };
  const walletRequired = () => {
    if (wallet && startLoad) return false;
    if (
      [
        MultiAddressSupportedEnum.NOT_SUPPORTED,
        MultiAddressSupportedEnum.SUPPORTED,
      ].includes(multiple.supported)
    )
      return true;
    if (selectableWallets.length > 0) return true;
    return false;
  };
  const addressRequired = () => {
    if (!walletRequired()) return false;
    return [
      MultiAddressSupportedEnum.NOT_SUPPORTED,
      MultiAddressSupportedEnum.SUPPORTED,
    ].includes(multiple.supported);
  };

  const selectableWallets = () => {
    if (wallet && startLoad) return [wallet];
    if (allowedWallets.length === 0) return wallets;
    return allowedWallets;
  };
  return {
    failed: getFailed(),
    description: getDescription(),
    loading: getLoading(),
    title: getTitle(),
    severity: getSeverity(),
    replyTo: ergoPayData.replyTo,
    selectWallet: walletRequired(),
    selectAddress: addressRequired(),
    allowMultipleAddress:
      multiple.supported === MultiAddressSupportedEnum.SUPPORTED,
    wallets: selectableWallets(),
  };
};

export default useMessage;
