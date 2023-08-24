import React from 'react';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  MobileStepper,
  Slider,
  Typography,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function () {
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = 4;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box>
      <Typography>
        Please scan code below on your cold wallet and generate signed
        transaction.
      </Typography>
      <Box
        sx={{
          width: 200,
          height: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mx: 'auto',
          mt: 2,
          border: '1px solid #ddd',
        }}
      >
        <QrCode2Icon sx={{ fontSize: 70, color: '#ddd' }} />
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            variant="text"
            fullWidth={false}
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
            variant="text"
            fullWidth={false}
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
      <Alert severity="info" icon={false}>
        <strong>Page Count—</strong>If your scanner can not scan the QR code,
        you can make bigger size code.
        <Box px={2}>
          <Slider valueLabelDisplay="auto" step={1} marks min={1} max={16} />
        </Box>
      </Alert>
    </Box>
  );
}
