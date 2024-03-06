import * as wasm from 'ergo-lib-wasm-browser';
import { useEffect, useState } from 'react';
import StateMessage from '../state-message/StateMessage';
import { CircularProgress } from '@mui/material';
import DisplayQRCode from '../display-qrcode/DisplayQRCode';
import { QrCodeTypeEnum } from '@/types/qrcode';

interface DisplaySignedTxPropsType {
  tx?: wasm.Transaction;
}

export const DisplaySignedTx = (props: DisplaySignedTxPropsType) => {
  const [loading, setLoading] = useState(false);
  const [tx, setTx] = useState('');
  const [txId, setTxId] = useState('');
  useEffect(() => {
    if (!loading && props.tx) {
      const tx = props.tx;
      const id = tx.id().to_str();
      if (id !== txId) {
        setLoading(true);
        setTx(Buffer.from(tx.sigma_serialize_bytes()).toString('base64'));
        setTxId(id);
        setLoading(false);
      }
    }
  }, [loading, props.tx, txId]);
  if (loading || props.tx === undefined) {
    return (
      <StateMessage
        title={''}
        description="Loading"
        icon={<CircularProgress />}
        color="default"
      />
    );
  }
  return <DisplayQRCode type={QrCodeTypeEnum.ColdSignTransaction} value={tx} />;
};
