import { QrCodeType, QrCodeTypeEnum } from '@minotaur-ergo/types';

import { detectPageFromJson } from '@/utils/qrcode';

import ColdSignTransaction from './cold-sign-transaction/ColdSignTransaction';
import ColdSigningRequest from './cold-signing-request/ColdSignignRequest';
import ErgoPay from './ergo-pay/ErgoPay';

const QrCodeTypes: Array<QrCodeType> = [
  {
    detect: (scanned: string) =>
      scanned.startsWith('ergopay:') ? scanned : undefined,
    render: (scanned: string, close: () => unknown) => (
      <ErgoPay scanned={scanned} close={close} />
    ),
    type: QrCodeTypeEnum.ErgoPay,
  },
  {
    detect: (scanned: string) =>
      detectPageFromJson(scanned, QrCodeTypeEnum.ColdSignRequest),
    render: (scanned: string, close: () => unknown) => (
      <ColdSigningRequest scanned={scanned} close={close} />
    ),
    type: QrCodeTypeEnum.ColdSignRequest,
  },
  {
    detect: (scanned: string) =>
      detectPageFromJson(scanned, QrCodeTypeEnum.ColdSignTransaction),
    render: (scanned: string, close: () => unknown) => (
      <ColdSignTransaction scanned={scanned} close={close} />
    ),
    type: QrCodeTypeEnum.ColdSignTransaction,
  },
];

export default QrCodeTypes;
