import { QrCodeScannedComponentPropsType } from '@minotaur-ergo/types';

import WithContext from '../../WithContext';
import ColdSignRequestInternal from './ColdSignRequestInternal';

const ColdSignRequest = (props: QrCodeScannedComponentPropsType) => {
  return (
    <WithContext close={props.close}>
      <ColdSignRequestInternal scanned={props.scanned} close={props.close} />
    </WithContext>
  );
};

export default ColdSignRequest;
