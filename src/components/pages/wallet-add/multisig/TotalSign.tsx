import React, { useState } from 'react';
import { Button, Container, Grid, Slider } from '@mui/material';

interface TotalSignPropsType {
  total: number;
  minSign: number;
  goBack?: () => unknown;
  goForward: (total: number, minSig: number) => unknown;
  children?: React.ReactNode;
}

const TotalSign = (props: TotalSignPropsType) => {
  const [total, setTotal] = useState(props.total);
  const [minSign, setMinSign] = useState(props.minSign);

  const handleSlideTotalSign = (event: Event, newValue: number | number[]) => {
    setTotal(newValue as number);
    if (minSign > newValue) {
      setMinSign(newValue as number);
    }
  };

  const handleSlideMinSign = (event: Event, newValue: number | number[]) => {
    setMinSign(newValue as number);
  };

  return (
    <Container>
      <Grid container columnSpacing={2} marginBottom={2}>
        <Grid item xs={12}>
          Total number of signers ({total})
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <br />
          Minimum Signature required ({Math.min(total, minSign)})
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Button variant="contained" color="primary" onClick={props.goBack}>
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.goForward(total, Math.min(total, minSign))}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TotalSign;
