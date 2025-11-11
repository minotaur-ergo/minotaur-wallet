import { QrCodeScannedComponentPropsType } from '@minotaur-ergo/types';

import ColdSignTransactionInternal from '@/components/qr-code-scanner/qrcode-types/cold-sign-transaction/ColdSignTransactionInternal';
import WithContext from '@/components/qr-code-scanner/WithContext';

const ColdSignTransaction = (props: QrCodeScannedComponentPropsType) => {
  return (
    <WithContext close={props.close}>
      <ColdSignTransactionInternal
        scanned={props.scanned}
        close={props.close}
      />
    </WithContext>
  );
};

export default ColdSignTransaction;
