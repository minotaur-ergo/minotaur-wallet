import React, { useEffect, useState } from 'react';
import {
  styled,
  Box,
  Button,
  Stack,
  Typography,
  TypographyProps,
} from '@mui/material';
import AppFrame from '@/layouts/AppFrame';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';

const CameraBox = styled(Box)(() => ({
  width: '100vw',
  height: 'calc(100vh - 72px)',
  position: 'fixed',
  top: 72,
  left: 0,
  zIndex: '-1',
  backgroundColor: 'black', // Just for demo
}));

const OverheadTypography = (props: TypographyProps) => {
  return (
    <Typography
      color="common.white"
      textAlign="center"
      py={2}
      px={4}
      {...props}
    />
  );
};

const DemoScanQR = styled(Box)(() => ({
  position: 'relative',
  width: '70%',
  aspectRatio: '1/1',
  border: '1px solid #fff',
  backgroundColor: '#ffffff11',
  margin: '150px auto 0',
  '& .line': {
    borderTop: '2px solid #fff',
    width: '100%',
    top: 0,
    position: 'absolute',
    animation: 'example 2s infinite linear',
  },
  '@keyframes example': {
    from: {
      top: 0,
    },
    to: {
      top: '100%',
    },
  },
}));

const Scan = () => {
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
    }, 5000);
  };
  // Enable the next button when the code is scanned.
  useEffect(handleNext, [pagesCount, step]);

  return (
    <AppFrame
      title="Scan QR Code"
      navigation={<BackButtonRouter />}
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
        <DemoScanQR sx={{ visibility: 'visible' }}>
          <div className="line" />
        </DemoScanQR>
      </CameraBox>
      {disableNext && (
        <OverheadTypography>
          Align the QR code within the frame to scan
        </OverheadTypography>
      )}
    </AppFrame>
  );
};

export default Scan;
