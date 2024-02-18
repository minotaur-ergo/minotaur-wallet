import * as wasm from 'ergo-lib-wasm-browser';
import React, { useState } from 'react';
import { StateWallet } from '../../../store/reducer/wallet';
import getChain from '../../../utils/networks';
import SuccessSend from '../success-send/SuccessSend';
import TxSubmitContext from './TxSubmitContext';
import { StatusEnum } from './TxSignContext';

interface TxSubmitContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
  close?: () => unknown;
  status?: StatusEnum;
  setStatus?: (newStatus: StatusEnum) => unknown;
}

const TxSubmitContextHandler = (props: TxSubmitContextHandlerPropsType) => {
  const [txId, setTxId] = useState('');
  const [error, setError] = useState('');
  const [internalStatus, internalSetStatus] = useState<StatusEnum>(
    StatusEnum.WAITING,
  );
  const usedStatus = props.status ?? internalStatus;
  const usedSetStatus = props.setStatus ?? internalSetStatus;

  const submitTx = (signed: wasm.Transaction) => {
    usedSetStatus(StatusEnum.SENDING);
    return getChain(props.wallet.networkType)
      .getNetwork()
      .sendTx(signed)
      .then(() => {
        usedSetStatus(StatusEnum.SENT);
        setTxId(signed.id().to_str());
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.reason);
        } else {
          setError('unknown error occurred. check application logs');
          console.log(err);
        }
        usedSetStatus(StatusEnum.ERROR);
      });
  };

  const close = () => {
    if (props.close) {
      props.close();
    }
    usedSetStatus(StatusEnum.WAITING);
  };

  return (
    <TxSubmitContext.Provider
      value={{
        submit: submitTx,
      }}
    >
      {props.children}
      <SuccessSend
        networkType={props.wallet.networkType}
        open={usedStatus === StatusEnum.SENT || usedStatus === StatusEnum.ERROR}
        id={txId}
        isSuccess={usedStatus === StatusEnum.SENT}
        msg={
          usedStatus === StatusEnum.SENT
            ? 'It can take about 2 minutes to mine your transaction. Also syncing your wallet may be slow.'
            : error
        }
        handleClose={close}
      />
    </TxSubmitContext.Provider>
  );
};

export default TxSubmitContextHandler;
