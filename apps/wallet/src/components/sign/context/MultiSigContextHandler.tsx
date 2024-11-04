import useMultiSigLocalRow from '@/hooks/multi-sig/useMultiSigLocalRow';
import useMultiSigServerRow from '@/hooks/signing-server/useMultiSigServerRow';
import { LOCAL_MULTI_SIG_COMMUNICATION, SERVER_MULTI_SIG_COMMUNICATION } from '@/utils/const';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GlobalStateType } from '@/store';
import { StateWallet } from '@/store/reducer/wallet';
import LoadingPage from '../../loading-page/LoadingPage';
import { MultiSigContext } from './MultiSigContext';
import { TxDataContext } from './TxDataContext';

interface MultiSigContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
}

const MultiSigContextHandler = (props: MultiSigContextHandlerPropsType) => {
  const [password, setPassword] = useState('');
  const { txId, type } = useParams();

  const lastUpdateTime = useSelector(
    (config: GlobalStateType) => config.config.multiSigLoadedTime,
  );
  const local = useMultiSigLocalRow(txId ?? '', props.wallet, lastUpdateTime, type === LOCAL_MULTI_SIG_COMMUNICATION)
  const server = useMultiSigServerRow(txId ?? '', props.wallet, lastUpdateTime, type === SERVER_MULTI_SIG_COMMUNICATION);
  const {serverId, rowId, tx, data, boxes, dataBoxes, storeData} = type === LOCAL_MULTI_SIG_COMMUNICATION ? local : server
  if (tx) {
    return (
      <MultiSigContext.Provider
        value={{
          data: data,
          password,
          requiredSign: props.wallet.requiredSign,
          rowId,
          setData: storeData,
          setPassword,
          isServer: type === SERVER_MULTI_SIG_COMMUNICATION,
          serverId,
        }}
      >
        <TxDataContext.Provider
          value={{
            wallet: props.wallet,
            tx: tx.unsigned_tx(),
            reduced: tx,
            dataBoxes: dataBoxes,
            boxes: boxes,
            networkType: props.wallet.networkType,
          }}
        >
          {props.children}
        </TxDataContext.Provider>
      </MultiSigContext.Provider>
    );
  }
  return <LoadingPage title={'Loading'} description={'Please wait'} />;
};

export default MultiSigContextHandler;
