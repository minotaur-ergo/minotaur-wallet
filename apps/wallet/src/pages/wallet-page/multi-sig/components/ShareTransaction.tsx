import { useContext, useMemo } from 'react';

import { MultiSigDataShare } from '@minotaur-ergo/types';
import { Box, Typography } from '@mui/material';

import { serialize } from '@/action/box';
import DisplayQRCode from '@/components/display-qrcode/DisplayQRCode';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';

const ShareTransaction = () => {
  const { hints } = useContext(MultiSigContext);
  const { reduced, boxes } = useContext(TxDataContext);
  // tx and boxes do not change while signing, so serialize them only once
  const serializedTx = useMemo(
    () =>
      reduced
        ? Buffer.from(reduced.sigma_serialize_bytes()).toString('base64')
        : '',
    [reduced],
  );
  const serializedBoxes = useMemo(() => boxes.map(serialize), [boxes]);
  const data = useMemo(() => {
    const res: MultiSigDataShare = {
      tx: serializedTx,
      boxes: serializedBoxes,
      hints: hints.map((row) => row.map((hint) => hint.serialize())),
    };
    return JSON.stringify(res);
  }, [serializedTx, serializedBoxes, hints]);
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
