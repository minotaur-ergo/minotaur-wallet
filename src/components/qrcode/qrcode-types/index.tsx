import React from 'react';
import { TxSignR, TxPublishR, ErgoPayR } from './QrCodeScanResult';
import TransactionSignRequest from './TransactionSignRequest';
import TransactionPublishRequest from './TransactionPublishRequest';
import ErgoPayRequest from './ErgoPayRequest';
import { JsonBI } from '../../../util/json';
import Wallet from '../../../db/entities/Wallet';

interface DetectParam {
  page: number;
  total: number;
  payload: string;
}

const detectPagedWithPrefix = (
  value: string,
  prefix: string
): DetectParam | null => {
  const valueParts = value.split('-');
  if (valueParts.length > 1) {
    const payload = valueParts.slice(1).join('-');
    const parts = valueParts[0].split('/');
    if (prefix === parts[0]) {
      return {
        page:
          parts.length > 1 && !isNaN(parseInt(parts[1]))
            ? parseInt(parts[1])
            : 1,
        total:
          parts.length > 1 && !isNaN(parseInt(parts[2]))
            ? parseInt(parts[2])
            : 1,
        payload: payload,
      };
    }
  }
  return null;
};

const Types = [
  {
    render: (
      param: string,
      close: () => unknown,
      completed?: (result: string) => unknown,
      wallet?: Wallet
    ) => (
      <TransactionSignRequest
        completed={completed}
        tx={JsonBI.parse(param)}
        closeQrcode={close}
      />
    ),
    type: TxSignR,
    detect: (value: string) => detectPagedWithPrefix(value, 'CSR'),
  },
  {
    render: (
      param: string,
      close: () => unknown,
      completed?: (result: string) => unknown,
      wallet?: Wallet
    ) => (
      <TransactionPublishRequest
        completed={completed}
        closeQrcode={close}
        tx={JsonBI.parse(param)}
      />
    ),
    type: TxPublishR,
    detect: (value: string) => detectPagedWithPrefix(value, 'CSTX'),
  },
  {
    render: (
      param: string,
      close: () => unknown,
      completed?: (result: string) => unknown,
      wallet?: Wallet
    ) => (
      <ErgoPayRequest completed={completed} closeQrcode={close} url={param} />
    ),
    type: ErgoPayR,
    detect: (value: string): DetectParam | null => {
      return value.startsWith('ergopay://')
        ? { page: 1, total: 1, payload: value.replace('ergopay://', '') }
        : null;
    },
  },
];

export default Types;
