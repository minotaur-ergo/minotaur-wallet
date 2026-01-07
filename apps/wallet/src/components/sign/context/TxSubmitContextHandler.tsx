import React, { useState } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet } from '@minotaur-ergo/types';
import { getChain } from '@minotaur-ergo/utils';

import SuccessSend from '../success-send/SuccessSend';
import { StatusEnum } from './TxSignContext';
import TxSubmitContext from './TxSubmitContext';

interface TxSubmitContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
  close?: () => unknown;
  status?: StatusEnum;
  setStatus?: (newStatus: StatusEnum) => unknown;
  // sendViaNode: () => void;
}

const TxSubmitContextHandler = (props: TxSubmitContextHandlerPropsType) => {
  const [txId, setTxId] = useState('');
  const [error, setError] = useState('');
  const [internalStatus, internalSetStatus] = useState<StatusEnum>(
    StatusEnum.WAITING,
  );
  const usedStatus = props.status ?? internalStatus;
  const usedSetStatus = props.setStatus ?? internalSetStatus;

  const submitTx = async (signed: wasm.Transaction, forceNode: boolean) => {
    usedSetStatus(StatusEnum.SENDING);
    const network = forceNode
      ? getChain(props.wallet.networkType).getNodeNetwork()
      : getChain(props.wallet.networkType).getExplorerNetwork();
    return network
      .sendTx(signed)
      .then(() => {
        usedSetStatus(StatusEnum.SENT);
        setTxId(signed.id().to_str());
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.reason);
        } else {
          setError(
            'Transaction submission failed. You can try submitting it via the node.',
          );
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
        // sendViaNode={props.sendViaNode}
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
