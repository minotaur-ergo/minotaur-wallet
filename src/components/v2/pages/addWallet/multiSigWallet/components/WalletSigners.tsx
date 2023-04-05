import React, { Dispatch, SetStateAction } from 'react';
import { Box, Typography, Slider } from '@mui/material';
import { WalletDataType } from '../MultiSigWallet';

interface PropsType {
  data: WalletDataType;
  setData: Dispatch<SetStateAction<WalletDataType>>;
}

export default function WalletSigners({ data, setData }: PropsType) {
  const { total, minSign } = data;

  const handleSlideTotalSign = (event: Event, newValue: number | number[]) => {
    setData((prevState) => ({ ...prevState, total: newValue as number }));
    if (minSign > newValue) {
      setData((prevState) => ({ ...prevState, minSign: newValue as number }));
    }
  };
  const handleSlideMinSign = (event: Event, newValue: number | number[]) => {
    setData((prevState) => ({ ...prevState, minSign: newValue as number }));
  };

  return (
    <Box>
      <Typography variant="subtitle2">From {total} cosigners</Typography>
      <Slider
        aria-label="Total Signers"
        value={total}
        onChange={handleSlideTotalSign}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={2}
        max={20}
      />
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Requires {Math.min(total, minSign)} signatures
      </Typography>
      <Slider
        aria-label="Minimum Required Signs"
        value={Math.min(total, minSign)}
        onChange={handleSlideMinSign}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={total}
      />
    </Box>
  );
}
