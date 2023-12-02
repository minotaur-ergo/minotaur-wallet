import React, { useState } from 'react';
import { MAX_CHUNK_SIZE, QRCODE_SIZE_DEFAULT } from '../../util/const';
import { Button, Grid, Slider } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react/lib';

interface RequestQrcodeDisplayPropsType {
  requestType: string;
  requestData: string;
}

const RequestQrcodeDisplay = (props: RequestQrcodeDisplayPropsType) => {
  const requestData = props.requestData.replaceAll('"', '\\"');
  const [chunkSize, setChunkSize] = useState(QRCODE_SIZE_DEFAULT);
  const [chunk, setChunk] = useState(0);
  const chunks = Math.ceil(requestData.length / chunkSize);
  // TODO must generate JSON object
  const req =
    chunks === 1
      ? `{"${props.requestType}": "${requestData}"}`
      : `{"${props.requestType}": "` +
        requestData.substring(chunk * chunkSize, chunkSize) +
        `", "n": ${chunks}, "p": ${chunk + 1}`;
  const gotoNext = () => {
    if (chunk < chunks - 1) {
      setChunk(chunk + 1);
    }
  };

  const gotoPrev = () => {
    if (chunk > 0) {
      setChunk(chunk - 1);
    }
  };
  const setNewChunkSize = (newValue: number | Array<number>) => {
    setChunkSize(typeof newValue === 'number' ? newValue : newValue[0]);
    setChunk(0);
  };
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <QRCodeSVG size={256} value={req} />
      </Grid>
      {chunks > 1 ? (
        <React.Fragment>
          <Grid item xs={12}>
            {chunk + 1} / {chunks}
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              onClick={gotoPrev}
              disabled={chunk === 0}
            >
              Prev
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              onClick={gotoNext}
              disabled={chunk >= chunks - 1}
            >
              Next
            </Button>
          </Grid>
        </React.Fragment>
      ) : null}
      <Grid item xs={12}>
        <div>
          If your qrcode scanner can not scan qrcode, you can make bigger size
          qrcode.
        </div>
        <Slider
          defaultValue={QRCODE_SIZE_DEFAULT}
          onChange={(event, newValue) => setNewChunkSize(newValue)}
          step={100}
          marks
          min={200}
          max={Math.min(MAX_CHUNK_SIZE, requestData.length)}
        />
      </Grid>
    </React.Fragment>
  );
};

export default RequestQrcodeDisplay;
