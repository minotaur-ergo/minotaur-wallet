import { QrCodeScannedComponentPropsType } from '@minotaur-ergo/types';

import WithContext from '@/components/qr-code-scanner/WithContext';

import ErgoPayInternal from './ErgoPayInternal';

const ErgoPay = (props: QrCodeScannedComponentPropsType) => {
  return (
    <WithContext close={props.close}>
      <ErgoPayInternal {...props} />
    </WithContext>
  );
};

export default ErgoPay;
