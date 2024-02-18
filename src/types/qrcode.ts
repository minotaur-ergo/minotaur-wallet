import React from 'react';

export interface QrCodePropsType {
  handleScan: (scan: string) => unknown;
  handleError: () => unknown;
}

export interface QrCodeContextType {
  start: () => Promise<string>;
}

export interface QrCodeCallback {
  resolve: (response: string) => unknown;
  reject: (reason: string) => unknown;
}

export interface QrCodeScannedComponentPropsType {
  scanned: string;
  close: () => unknown;
}

export const enum QrCodeTypeEnum {
  ColdSignRequest = 'CSR',
  ColdSignTransaction = 'CSTX',
  ErgoPay = 'ergopay',
  MultiSigRequest = 'MSR',
}

export interface DetectParam {
  page: number;
  total: number;
  payload: string;
}

export interface QrCodeType {
  render?: (scanned: string, close: () => unknown) => React.ReactNode;
  detect: (scanned: string) => boolean;
  type: QrCodeTypeEnum;
}

type ChunkDataDisplay = Record<QrCodeTypeEnum, string>;

export interface ChunkedData extends ChunkDataDisplay {
  p?: number;
  n?: number;
}

export interface ChunkResponse {
  displayChunks: boolean;
  error: string;
  loading: boolean;
  completedChunks: number;
  totalPages: number;
  data: string;
  last: string;
}

export interface ColdSigningRequestData {
  reducedTx: string;
  sender?: string;
  inputs: Array<string>;
}
