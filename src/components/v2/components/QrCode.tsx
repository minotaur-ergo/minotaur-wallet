import {
  Box,
  Button,
  Card,
  Collapse,
  IconButton,
  MobileStepper,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import qr from '../sample-qr.png';
import {
  ContentCopyOutlined,
  DownloadOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  PauseCircleOutline,
  PlayCircleOutline,
  ZoomIn,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import ToggleIconButton from './ToggleIconButton';

interface PropsType {
  showToolbar?: boolean;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  showPlayButton?: boolean;
  showConfigButton?: boolean;
  interval?: number;
}

export default function QrCode({
  showConfigButton = true,
  showCopyButton = true,
  showDownloadButton = true,
  showPlayButton = true,
  showToolbar = true,
  interval = 1000,
}: PropsType) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [pagesCount, setPagesCount] = useState<number>(1);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timer>();

  const endStep = pagesCount - 1;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleChangePagesCount = (
    event: Event,
    newValue: number | number[]
  ) => {
    setPagesCount(newValue as number);
  };
  const handleToggleShowConfig = () => setShowConfig((prevState) => !prevState);
  const stop = () => {
    clearInterval(timeInterval);
    setPlaying(false);
  };
  const handleTogglePlay = () => {
    if (playing) {
      stop();
    } else {
      setActiveStep(0);
      setPlaying(true);
      setTimeInterval(setInterval(handleNext, interval));
    }
  };

  useEffect(() => {
    setActiveStep(0);
  }, [pagesCount]);

  useEffect(() => {
    if (activeStep === endStep) stop();
  }, [activeStep]);

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <img src={qr} width="100%" />
      <Collapse in={pagesCount > 1}>
        <MobileStepper
          variant="text"
          steps={pagesCount}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === endStep}
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
        />
      </Collapse>
      <Collapse in={showConfig}>
        <Box mt={1}>
          <Typography variant="body2">
            <Typography component="span" color="text.secondary">
              Number of pages:{' '}
            </Typography>
            {pagesCount}
          </Typography>
          <Slider
            value={pagesCount}
            onChange={handleChangePagesCount}
            min={1}
            max={8}
            disabled={playing}
          />
        </Box>
      </Collapse>
      <Collapse in={showToolbar}>
        <Stack direction="row" justifyContent="center" spacing={1} mt={1}>
          {showCopyButton && (
            <IconButton>
              <ContentCopyOutlined />
            </IconButton>
          )}
          {showDownloadButton && (
            <IconButton>
              <DownloadOutlined />
            </IconButton>
          )}
          {showPlayButton && (
            <ToggleIconButton
              selected={playing}
              onClick={handleTogglePlay}
              disabled={pagesCount === 1}
            >
              {playing ? <PauseCircleOutline /> : <PlayCircleOutline />}
            </ToggleIconButton>
          )}
          {showConfigButton && (
            <ToggleIconButton
              selected={showConfig}
              onClick={handleToggleShowConfig}
            >
              <ZoomIn />
            </ToggleIconButton>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
}
