import { useContext, useEffect, useState } from 'react';

import { MultiSigDataShare } from '@minotaur-ergo/types';
import { Box, Typography } from '@mui/material';

import { serialize } from '@/action/box';
import DisplayQRCode from '@/components/display-qrcode/DisplayQRCode';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';

const ShareTransaction = () => {
  const [data, setData] = useState('');
  const context = useContext(MultiSigContext);
  const txData = useContext(TxDataContext);
  useEffect(() => {
    const res: MultiSigDataShare = {
      tx: txData.reduced
        ? Buffer.from(txData.reduced.sigma_serialize_bytes()).toString('base64')
        : '',
      boxes: txData.boxes.map(serialize),
      hints: context.hints.map((row) => row.map((hint) => hint.serialize())),
    };
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
