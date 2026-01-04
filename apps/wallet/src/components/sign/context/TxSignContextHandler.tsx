import React, { useCallback, useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet, WalletType } from '@minotaur-ergo/types';

import { multiSigStoreNewTx } from '@/action/multi-sig/store';
import { signNormalWalletReducedTx, signNormalWalletTx } from '@/action/tx';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import { getRoute, RouteMap } from '@/router/routerMap';

import TxDataContextHandler from './TxDataContextHandler';
import TxSignContext, { StatusEnum } from './TxSignContext';
import TxSubmitContext from './TxSubmitContext';
import TxSubmitContextHandler from './TxSubmitContextHandler';

interface TxSignContextHandlerInternalPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
  close: (force?: boolean) => unknown;
  denySubmit?: boolean;
  status: StatusEnum;
  setStatus: (newStatus: StatusEnum) => unknown;
}

interface TxSignContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
  close?: () => unknown;
  denySubmit?: boolean;
  // sendViaNode: () => void;
}

const TxSignContextHandlerInternal = (
  props: TxSignContextHandlerInternalPropsType,
) => {
  const navigate = useNavigate();
  const [tx, setTx] = useState<wasm.UnsignedTransaction | undefined>();
  const [reduced, setReducedTx] = useState<
    wasm.ReducedTransaction | undefined
  >();
  const [boxes, setBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [dataBoxes, setDataBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [password, setPassword] = useState('');
  const [signedStr, setSignedStr] = useState('');
  const qrCodeContext = useContext(QrCodeContext);
  const submitContext = useContext(TxSubmitContext);
  const signer = useSignerWallet(props.wallet);
  const sendViaNodeRef = useRef<() => void>();

  const setSendViaNode = useCallback((fn?: () => void) => {
    sendViaNodeRef.current = fn;
  }, []);
  const setTransactionDetail = (
    tx: wasm.UnsignedTransaction | undefined,
    boxes: Array<wasm.ErgoBox>,
    dataBoxes?: Array<wasm.ErgoBox>,
  ) => {
    setTx(tx);
    setBoxes(boxes);
    setDataBoxes(dataBoxes ?? []);
  };
  const setReducedTransactionDetail = (
    reducedTx: wasm.ReducedTransaction | undefined,
  ) => {
    if (
      reducedTx?.unsigned_tx().id().to_str() !==
      reduced?.unsigned_tx().id().to_str()
    ) {
      setReducedTx(reducedTx);
    }
  };

  const handleNormalReducedTx = (forceNode: boolean) => {
    if (reduced) {
      return signNormalWalletReducedTx(props.wallet, password, reduced).then(
        (signed) => {
          if (props.denySubmit) {
            setSignedStr(
              JSON.stringify({
                signedTx: Buffer.from(signed.sigma_serialize_bytes()).toString(
                  'base64',
                ),
              }),
            );
          } else {
            submitContext.submit(signed, forceNode);
          }
        },
      );
    }
  };

  const handleNormalTx = (forceNode: boolean) => {
    if (tx) {
      props.setStatus(StatusEnum.SIGNING);
      return signNormalWalletTx(
        props.wallet,
        password,
        tx,
        boxes,
        dataBoxes,
        forceNode,
      ).then((signed) => {
        submitContext.submit(signed, forceNode);
      });
    }
  };

  const handle = async (forceNode: boolean) => {
    console.log(forceNode);
    console.log(tx);
    console.log(props.status);
    console.log(props.wallet.type);
    if (tx && props.status === StatusEnum.WAITING) {
      switch (props.wallet.type) {
        case WalletType.Normal:
          if (
            reduced &&
            reduced.unsigned_tx().id().to_str() === tx.id().to_str()
          ) {
            await handleNormalReducedTx(forceNode);
          } else {
            await handleNormalTx(forceNode);
          }
          break;
        case WalletType.ReadOnly:
          qrCodeContext.start();
          break;
        case WalletType.MultiSig:
          if (signer && signer.type === WalletType.ReadOnly) {
            qrCodeContext.start();
          } else if (reduced) {
            await multiSigStoreNewTx(reduced, boxes, props.wallet);
            props.close(true);
            navigate(
              getRoute(RouteMap.WalletMultiSig, { id: props.wallet.id }),
            );
            navigate(
              getRoute(RouteMap.WalletMultiSigTxView, {
                id: props.wallet.id,
                txId: reduced.unsigned_tx().id().to_str(),
              }),
            );
          }
          break;
        default:
      }
    }
  };

  return (
    <TxSignContext.Provider
      value={{
        setReducedTx: setReducedTransactionDetail,
        networkType: props.wallet.networkType,
        password,
        handle,
        status: props.status,
        setPassword,
        setTx: setTransactionDetail,
        signed: signedStr,
        sendViaNode: sendViaNodeRef.current,
        setSendViaNode,
      }}
    >
      <TxDataContextHandler
        wallet={props.wallet}
        boxes={boxes}
        dataBoxes={dataBoxes}
        reduced={reduced}
        tx={tx}
      >
        {props.children}
      </TxDataContextHandler>
    </TxSignContext.Provider>
  );
};

const TxSignContextHandler = (props: TxSignContextHandlerPropsType) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.WAITING);

  const close = (force?: boolean) => {
    if (status === StatusEnum.SENT || force) {
      if (props.close) {
        props.close();
      } else {
        navigate(-1);
      }
    } else {
      setStatus(StatusEnum.WAITING);
    }
  };

  return (
    <TxSubmitContextHandler
      wallet={props.wallet}
      status={status}
      setStatus={setStatus}
      close={close}
      // sendViaNode={props.sendViaNode}
    >
      <TxSignContextHandlerInternal
        close={close}
        setStatus={setStatus}
        status={status}
        wallet={props.wallet}
        denySubmit={props.denySubmit}
      >
        {props.children}
      </TxSignContextHandlerInternal>
    </TxSubmitContextHandler>
  );
};

export default TxSignContextHandler;
