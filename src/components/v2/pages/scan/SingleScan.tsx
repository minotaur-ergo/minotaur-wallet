import React, { useEffect, useState } from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Box, Button, Stack, Typography, IconButton } from '@mui/material';
import { DocumentScannerOutlined } from '@mui/icons-material';
import { CameraBox, DemoScanQR, OverheadTypography } from './Scan';

interface PropsType {
  changeMode: () => void;
}

const SingleScan = ({ changeMode }: PropsType) => {
  const [step, setStep] = useState(0);
  const [disableNext, setDisableNext] = useState(true);
  const [pagesCount, setPagesCount] = React.useState<null | number>(null);

  // Go to scan the next page
  const handleNext = () => {
    if (pagesCount && step === pagesCount) {
      // Scan finished. Do anything to do...
    }
    setDisableNext(true);
    setTimeout(() => {
      if (step === 0) {
        setPagesCount(4);
      }
      setStep((prevState) => prevState + 1);
      setDisableNext(false);
    }, 2000);
  };
  // Enable the next button when the code is scanned.
  useEffect(handleNext, []);

  return (
    <AppFrame
      title="Scan QR Code"
      navigation={<BackButton />}
      actions={
        <IconButton onClick={changeMode}>
          <DocumentScannerOutlined />
        </IconButton>
      }
      toolbar={
        <Stack spacing={2}>
          {step === pagesCount && (
            <OverheadTypography>Scan finished.</OverheadTypography>
          )}
          {step === 3 && (
            <OverheadTypography color="warning.main">
              Error occurred; try again!
            </OverheadTypography>
          )}
          {pagesCount && step < pagesCount && (
            <Box>
              <OverheadTypography>
                <Typography component="span" fontSize="large">
                  {step}/{pagesCount}
                </Typography>
                <br />
                More pages are required for this QR code to complete.
              </OverheadTypography>
            </Box>
          )}
          {(step === 0 || (pagesCount && step < pagesCount)) && (
            <Button onClick={handleNext} disabled={disableNext}>
              Next
            </Button>
          )}
        </Stack>
      }
    >
      <CameraBox>
        {/* Replace camera component with the following demo component */}
        <Typography
          mb={6}
          sx={{ visibility: disableNext ? 'visible' : 'hidden' }}
        >
          Align the QR code within the frame to scan
        </Typography>
        <DemoScanQR sx={{ visibility: disableNext ? 'visible' : 'hidden' }}>
          <div className="line" />
        </DemoScanQR>
      </CameraBox>
    </AppFrame>
  );
};

export default SingleScan;
