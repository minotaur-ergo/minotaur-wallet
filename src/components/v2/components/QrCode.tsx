import { Box, Button, MobileStepper } from '@mui/material';
import qr from '../sample-qr.png';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useState } from 'react';

interface PropsType {
  pagesCount?: number;
}

export default function QrCode({ pagesCount = 1 }: PropsType) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <Box p={2}>
        <img src={qr} width="100%" />
        <MobileStepper
          variant="text"
          steps={pagesCount}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === pagesCount - 1}
              fullWidth={false}
              variant="text"
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              fullWidth={false}
              variant="text"
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
          sx={{ p: 0 }}
        />
      </Box>
    </>
  );
}
