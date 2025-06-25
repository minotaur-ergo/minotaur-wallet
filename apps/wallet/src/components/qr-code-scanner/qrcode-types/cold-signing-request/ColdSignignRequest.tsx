import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ColdSigningRequestData, GlobalStateType } from '@minotaur-ergo/types';
import { getChain } from '@minotaur-ergo/utils';
import { Inventory2Outlined } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import * as wasm from 'ergo-lib-wasm-browser';

import { deserialize } from '@/action/box';
import BackButton from '@/components/back-button/BackButton';
import LoadingPage from '@/components/loading-page/LoadingPage';
import SignButtonLabel from '@/components/sign-button-label/SignButtonLabel';
import { SelectableWalletContext } from '@/components/sign/context/SelectableWalletContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import TxSignContext from '@/components/sign/context/TxSignContext';
import TransactionBoxes from '@/components/sign/transaction-boxes/TransactionBoxes';
import CenterMessage from '@/components/state-message/CenterMessage';
import SvgIcon from '@/icons/SvgIcon';
import AppFrame from '@/layouts/AppFrame';
import SignTx from '@/pages/wallet-page/send/sign-tx/SignTx';

interface ColdSigningRequestPropsType {
  scanned: string;
  close: () => unknown;
}

const ColdSigningRequest = (props: ColdSigningRequestPropsType) => {
  const [loaded, setLoaded] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');
  const walletContext = useContext(SelectableWalletContext);
  const [displayBoxes, setDisplayBoxes] = useState(false);
  const txSignContext = useContext(TxSignContext);
  const context = useContext(TxDataContext);
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  useEffect(() => {
    if (props.scanned !== loaded && !loading) {
      try {
        setLoading(true);
        setError('');
        const data = JSON.parse(props.scanned) as ColdSigningRequestData;
        const reduced = wasm.ReducedTransaction.sigma_parse_bytes(
          Buffer.from(data.reducedTx, 'base64'),
        );
        const boxes = data.inputs.map(deserialize);
        if (data.sender) {
          const filtered = wallets.filter(
            (item) =>
              item.addresses.filter(
                (address) => address.address === data.sender,
              ).length > 0,
          );
          if (filtered.length >= 1) {
            walletContext.setWallet(filtered[0]);
          } else {
            setError('Transaction does not belong to any of your wallets');
          }
        } else {
          const inputAddresses = boxes.map((item) =>
            wasm.Address.recreate_from_ergo_tree(item.ergo_tree()),
          );
          const filtered = wallets.filter((wallet) => {
            const chain = getChain(wallet.networkType);
            const prefix = chain.prefix;
            const inputAddressStr = inputAddresses.map((item) =>
              item.to_base58(prefix),
            );
            return (
              wallet.addresses
                .map((address) => address.address)
                .filter((address) => inputAddressStr.includes(address)).length >
              0
            );
          });
          if (filtered.length === 1) {
            walletContext.setWallet(filtered[0]);
          } else {
            setError(
              'Can Not Determine Which Wallet Can Sign This Transaction. Please Fill Sender Field in Request',
            );
          }
        }
        txSignContext.setReducedTx(reduced);
        txSignContext.setTx(reduced.unsigned_tx(), boxes);
        setHasError(false);
      } catch (exp) {
        console.error(exp);
        setError('Invalid Data Scanned');
        setHasError(true);
      }
      setLoaded(props.scanned);
      setLoading(false);
    }
  }, [props.scanned, loaded, loading, txSignContext, wallets, walletContext]);
  if (loading || walletContext.wallet === undefined) {
    return <LoadingPage />;
  }
  return (
    <AppFrame
      title="Cold Signing Request"
      navigation={<BackButton onClick={props.close} />}
      actions={
        context.tx ? (
          <IconButton onClick={() => setDisplayBoxes(true)}>
            <Inventory2Outlined />
          </IconButton>
        ) : undefined
      }
      toolbar={
        context.tx &&
        walletContext.wallet &&
        error === '' &&
        txSignContext.signed === '' ? (
          <Button disabled={hasError} onClick={() => txSignContext.handle()}>
            <SignButtonLabel wallet={walletContext.wallet} />
          </Button>
        ) : undefined
      }
    >
      {error ? (
        <CenterMessage
          icon={
            <SvgIcon
              icon="warning"
              color="error"
              style={{ marginBottom: -8 }}
            />
          }
          color="error.dark"
          description={[error]}
        />
      ) : (
        <React.Fragment>
          <SignTx
            wallet={walletContext.wallet}
            setHasError={setHasError}
            hideLoading={true}
          />
          <TransactionBoxes
            open={displayBoxes}
            handleClose={() => setDisplayBoxes(false)}
          />
        </React.Fragment>
      )}
    </AppFrame>
  );
};

export default ColdSigningRequest;
