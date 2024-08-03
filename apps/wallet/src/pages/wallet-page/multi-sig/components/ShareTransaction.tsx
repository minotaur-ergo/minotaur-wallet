import { Box, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { serialize } from '@/action/box';
import DisplayQRCode from '@/components/display-qrcode/DisplayQRCode';

const ShareTransaction = () => {
  const [data, setData] = useState('');
  const context = useContext(MultiSigContext);
  const txData = useContext(TxDataContext);
  useEffect(() => {
    const res = {
      tx: txData.reduced
        ? Buffer.from(txData.reduced.sigma_serialize_bytes()).toString('base64')
        : '',
      boxes: txData.boxes.map(serialize),
      commitments: context.data.commitments,
      simulated: [] as Array<string>,
      signed: [] as Array<string>,
      partial: '',
    };
    if (context.data.partial) {
      res.partial = Buffer.from(
        context.data.partial.sigma_serialize_bytes(),
      ).toString('base64');
      res.simulated = context.data.simulated;
      res.signed = context.data.signed;
    }
    const newData = JSON.stringify(res);
    if (data !== newData) {
      setData(newData);
    }
  }, [txData, context, data]);
  return (
    <Box my={2}>
      <Typography gutterBottom>
        Please share transaction data to the other signers.
      </Typography>
      <DisplayQRCode value={data} type="MSR" />
    </Box>
  );
};

export default ShareTransaction;
