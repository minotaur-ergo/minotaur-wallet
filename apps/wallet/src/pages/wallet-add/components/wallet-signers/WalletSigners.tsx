import { useEffect } from 'react';

import { Box, Slider, Typography } from '@mui/material';

interface WalletSignersPropsType {
  signers: number;
  threshold: number;
  setHasError: (hasError: boolean) => unknown;
  setSigners: (signers: number) => unknown;
  setThreshold: (threshold: number) => unknown;
}

const WalletSigners = (props: WalletSignersPropsType) => {
  const handleSlideTotalSign = (_event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    props.setSigners(value);
    if (props.threshold > value) {
      props.setThreshold(value);
    }
  };
  const handleSlideMinSign = (_event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    props.setThreshold(value);
  };

  useEffect(() => {
    props.setHasError(false);
  });

  return (
    <Box>
      <Typography variant="subtitle2">
        From {props.signers} co-signer{props.signers > 1 ? 's' : ''}
      </Typography>
      <Slider
        aria-label="Total Signers"
        value={props.signers}
        onChange={handleSlideTotalSign}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={2}
        max={20}
      />
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Requires {Math.min(props.signers, props.threshold)} signature
        {props.signers === 1 ? '' : 's'}
      </Typography>
      <Slider
        aria-label="Minimum Required Signs"
        value={Math.min(props.signers, props.threshold)}
        onChange={handleSlideMinSign}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={props.signers}
      />
    </Box>
  );
};

export default WalletSigners;
