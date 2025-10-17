import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import * as wasm from '@minotaur-ergo/ergo-lib';
import {
  ErgoPaySeverityEnum,
  GlobalStateType,
  MessageResponseType,
  MultiAddressSupportedEnum,
  StateAddress,
  StateWallet,
} from '@minotaur-ergo/types';
import { createEmptyArrayWithIndex } from '@minotaur-ergo/utils';

import { SelectableWalletContext } from '@/components/sign/context/SelectableWalletContext';
import TxSignContext, {
  TxSignContextType,
} from '@/components/sign/context/TxSignContext';
import { fetchBoxesFromNetwork, getInternalBoxes } from '@/utils/ergopay';

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

interface CalculationResponse {
  allowedWallets?: Array<StateWallet>;
  tx: string;
  error: string;
}

const calculateData = async (
  wallets: Array<StateWallet>,
  wallet: StateWallet | undefined,
  reducedTx: string,
  context: TxSignContextType,
): Promise<CalculationResponse> => {
  const ergoPayTx = wasm.ReducedTransaction.sigma_parse_bytes(
    Buffer.from(reducedTx, 'base64'),
  );
  const unsigned = ergoPayTx.unsigned_tx();
  const inputs = unsigned.inputs();
  const boxIds = createEmptyArrayWithIndex(inputs.len()).map((index) =>
    inputs.get(index).box_id().to_str(),
  );
  const boxes = await getInternalBoxes(boxIds);
  if (
    Object.keys(boxes).length === 0 ||
    (wallet && !Object.prototype.hasOwnProperty.call(boxes, `${wallet.id}`))
  ) {
    return {
      tx: reducedTx,
      error: 'This transaction does not belong to this wallet',
    };
  }
  if (!wallet && Object.keys(boxes).length > 1) {
    return {
      allowedWallets: wallets.filter((item) =>
        Object.keys(boxes).includes(`${item.id}`),
      ),
      tx: reducedTx,
      error: '',
    };
  }
  const walletId = wallet ? `${wallet.id}` : Object.keys(boxes)[0];
  const foundedWallet = wallets.filter((item) => `${item.id}` === walletId);
  if (foundedWallet.length === 0) {
    return {
      tx: reducedTx,
      error: 'Internal error. wallet not found',
    };
  }
  const allBoxes = await fetchBoxesFromNetwork(
    boxIds,
    boxes[walletId],
    foundedWallet[0],
  );
  context.setReducedTx(ergoPayTx);
  context.setTx(unsigned, allBoxes);
  return {
    tx: reducedTx,
    allowedWallets: foundedWallet,
    error: '',
  };
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
      calculateData(wallets, wallet, ergoPayData.reducedTx, context).then(
        (res) => {
          if (res.tx) setLoadedTx(res.tx);
          if (res.error) setError(res.error);
          if (res.allowedWallets) setAllowedWallets(res.allowedWallets);
          setLoading(false);
        },
      );
    }
  }, [ergoPayData, loadedTx, loading, wallet, wallets, context]);
  useEffect(() => {
    if (wallet || allowedWallets.length === 1) {
      walletContext.setWallet(wallet ?? allowedWallets[0]);
    }
  }, [wallet, allowedWallets, walletContext]);
  const isLoading = useMemo(() => {
    return (
      multiple.supported === MultiAddressSupportedEnum.NOT_CHECKED ||
      ergoPayData.loading ||
      loading
    );
  }, [multiple.supported, ergoPayData.loading, loading]);
  const description = useMemo(() => {
    const errorBody = { color: 'red', body: error };
    if (isLoading) return ['Please wait'];
    if (multiple.description.length > 0) return [...multiple.description];
    if (ergoPayData.message)
      return [...ergoPayData.message.split('\n'), errorBody];
    return [];
  }, [multiple.description, ergoPayData.message, error, isLoading]);
  const title = useMemo(() => {
    if (multiple.supported === MultiAddressSupportedEnum.NOT_CHECKED)
      return 'Checking Multiple Address Support';
    if (ergoPayData.loading) return 'Loading ErgoPay data';
    if (loading) return 'Loading transaction details';
    if (multiple.title) return multiple.title;
    return '';
  }, [multiple.supported, ergoPayData.loading, loading, multiple.title]);
  const failed = useMemo(
    () =>
      ergoPayData.failed ||
      multiple.severity === MultiAddressSupportedEnum.FAILED,
    [ergoPayData.failed, multiple.severity],
  );
  const severity = useMemo(() => {
    if (ergoPayData.messageSeverity)
      return getErgoPaySeverity(ergoPayData.messageSeverity);
    if (multiple.severity) return multiple.severity;
    return '';
  }, [ergoPayData.messageSeverity, multiple.severity]);
  const selectableWallets = useMemo(() => {
    if (wallet && startLoad) return [wallet];
    if (allowedWallets.length === 0) return wallets;
    return allowedWallets;
  }, [wallet, startLoad, allowedWallets, wallets]);
  const walletRequired = useMemo(() => {
    if (wallet && startLoad) return false;
    if (
      [
        MultiAddressSupportedEnum.NOT_SUPPORTED,
        MultiAddressSupportedEnum.SUPPORTED,
      ].includes(multiple.supported)
    )
      return true;
    return selectableWallets.length > 0;
  }, [wallet, startLoad, multiple.supported, selectableWallets]);
  const addressRequired = useMemo(() => {
    if (!walletRequired) return false;
    return [
      MultiAddressSupportedEnum.NOT_SUPPORTED,
      MultiAddressSupportedEnum.SUPPORTED,
    ].includes(multiple.supported);
  }, [walletRequired, multiple.supported]);

  return useMemo(
    () => ({
      loading: isLoading,
      failed,
      description,
      title,
      severity,
      replyTo: ergoPayData.replyTo,
      selectWallet: walletRequired,
      selectAddress: addressRequired,
      allowMultipleAddress:
        multiple.supported === MultiAddressSupportedEnum.SUPPORTED,
      wallets: selectableWallets,
    }),
    [
      isLoading,
      failed,
      description,
      title,
      severity,
      ergoPayData.replyTo,
      walletRequired,
      addressRequired,
      multiple.supported,
      selectableWallets,
    ],
  );
};

export default useMessage;
