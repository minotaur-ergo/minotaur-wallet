import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useContext, useEffect, useState } from 'react';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { StateWallet } from '@minotaur-ergo/types';
import DisplayQRCode from '@/components/display-qrcode/DisplayQRCode';
import StateMessage from '@/components/state-message/StateMessage';
import { serialize } from '@/action/box';
import useReducedTx from '@/hooks/useReducedTx';
import { QrCodeTypeEnum } from '@/types/qrcode';

interface WalletSignReadonlyPropsType {
  wallet: StateWallet;
  setHasError: (hasError: boolean) => unknown;
}

const WalletSignReadonly = (props: WalletSignReadonlyPropsType) => {
  const txDataContext = useContext(TxDataContext);
  const [serialized, setSerialized] = useState('');
  const [txId, setTxId] = useState('');
  const isValid = useReducedTx();
  useEffect(() => {
    props.setHasError(isValid);
  });
  useEffect(() => {
    if (txDataContext.reduced !== undefined) {
      const reduced = txDataContext.reduced;
      const unsigned = reduced.unsigned_tx();
      if (unsigned.id().to_str() !== txId) {
        const encoded = Buffer.from(reduced.sigma_serialize_bytes()).toString(
          'base64',
        );
        const dataJSON = JSON.stringify({
          reducedTx: encoded,
          sender: txDataContext.wallet.addresses[0].address,
          inputs: txDataContext.boxes.map(serialize),
        });
        setSerialized(dataJSON);
        setTxId(unsigned.id().to_str());
      }
    }
  }, [txDataContext.reduced, txId, txDataContext.boxes, txDataContext.wallet]);

  return (
    <React.Fragment>
      {isValid ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <StateMessage
            title="Preparing Cold Signing Transaction"
            description="Please wait"
            icon={<CircularProgress />}
          />
        </Box>
      ) : (
        <DisplayQRCode value={serialized} type={QrCodeTypeEnum.ColdSignRequest}>
          <Typography>
            Please scan code below on your cold wallet and generate signed
            transaction.
          </Typography>
        </DisplayQRCode>
      )}
    </React.Fragment>
  );
};

export default WalletSignReadonly;
