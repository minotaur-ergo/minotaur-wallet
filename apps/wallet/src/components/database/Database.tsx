import React, { useState, useEffect, useContext } from 'react';
import { DataSource } from 'typeorm';
import { Capacitor } from '@capacitor/core';
import Splash from '../splash/Splash';
import connectCapacitor from './connector/capacitor';
import connectSqlJs from './connector/sqljs';
import MessageContext from '../app/messageContext';
import { initializeAction } from '@/action/db';

let dataSource: DataSource;

export interface DatabasePropsType {
  children?: React.ReactNode;
}

const enum ConnectionStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  NOT_CONNECTED = 'not connected',
}
const createDataSource = async () =>
  Capacitor.getPlatform() === 'web' ? connectSqlJs() : connectCapacitor();

const Database = (props: DatabasePropsType) => {
  const context = useContext(MessageContext);
  const [status, setStatus] = useState<ConnectionStatus>(
    ConnectionStatus.NOT_CONNECTED,
  );
  useEffect(() => {
    if (status === ConnectionStatus.NOT_CONNECTED) {
      setStatus(ConnectionStatus.CONNECTING);
      setTimeout(() => {
        createDataSource()
          .then((newDataSource) => {
            dataSource = newDataSource;
            initializeAction(dataSource);
            setTimeout(() => setStatus(ConnectionStatus.CONNECTED), 300);
          })
          .catch((exp) => {
            console.log(exp);
            context.insert(exp.message, 'error');
            setTimeout(() => setStatus(ConnectionStatus.NOT_CONNECTED), 60000); // Try again in one minutes;
          });
      }, 300);
    }
  }, [status, context]);
  return (
    <>{status === ConnectionStatus.CONNECTED ? props.children : <Splash />}</>
  );
};

export default Database;
