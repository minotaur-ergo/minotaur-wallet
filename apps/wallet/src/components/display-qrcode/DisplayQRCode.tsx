import ToggleIconButton from '@/components/toggle-icon-button/ToggleIconButton';
import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  IconButton,
  MobileStepper,
  Slider,
  Stack,
  Typography
} from '@mui/material';
import QRCodeSVG from './QrCodeSVG';
import { MAX_CHUNK_SIZE, QRCODE_MINIMUM_CHUNK_SIZE } from '@/utils/const';
import {
  ContentCopyOutlined, DownloadOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight, PauseCircleOutline, PlayCircleOutline, ZoomIn
} from '@mui/icons-material';
import CopyToClipboard from '../copy-to-clipboard/CopyToClipboard';

interface DisplayQRCodePropsType {
  value: string;
  type: string;
  children?: React.ReactNode;
}

const DisplayQRCode = (props: DisplayQRCodePropsType) => {
  const dataSize = props.value.length;
  const minPages = Math.ceil(
    dataSize / (MAX_CHUNK_SIZE - 10 - props.type.length)
  );
  const maxPages = Math.ceil(dataSize / QRCODE_MINIMUM_CHUNK_SIZE);
  const [pageCount, setPageCount] = useState(minPages);
  const usedPageCount = Math.max(Math.min(pageCount, maxPages), minPages);
  const size = Math.ceil(props.value.length / usedPageCount);
  const [index, setIndex] = useState(0);
  const chunk = props.value.substring(index * size, (index + 1) * size);
  const [animatedTimer, setAnimatedTimer] = useState<NodeJS.Timeout|undefined>();
  const playing = animatedTimer !== undefined
  const handleSizeSlicer = (_event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setPageCount(value);
    setIndex(0);
  };
  const maxSteps = Math.ceil(props.value.length / size);
  const value = JSON.stringify({
    [props.type]: chunk,
    p: index + 1,
    n: maxSteps,
    a: playing ? 0 : 1
  });
  const copyValue = JSON.stringify({ [props.type]: props.value });
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const startPlaying = () => {
    const timer = setInterval(() => {
      setIndex(index => (index + 1) % maxPages)
    }, 800)
    setAnimatedTimer(timer)
    setIndex(0)
    setPageCount(maxPages)
  }
  const handlePlaying = () => {
    if (animatedTimer) {
      clearTimeout(animatedTimer)
      setAnimatedTimer(undefined);
    }else{
      startPlaying()
    }
  }
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Box
        sx={{
          width: 300,
          height: 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mx: 'auto',
          mt: 2,
          border: '0'
        }}
      >
        <QRCodeSVG value={value} />
      </Box> <Collapse in={pageCount > 1}>
      <MobileStepper
        variant="text"
        steps={pageCount}
        position="static"
        activeStep={index}
        nextButton={
          <Button
            size="small"
            onClick={() => setIndex(index + 1)}
            disabled={index >= maxSteps - 1 || playing}
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
            onClick={() => setIndex(index - 1)}
            disabled={index <= 0 || playing}
            fullWidth={false}
            variant="text"
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Collapse>
      <Collapse in={showConfig && !playing}>
        <Box mt={1}>
          <Typography variant="body2">
            <Typography component="span" color="text.secondary">
              Number of pages:{' '}
            </Typography>
            {pageCount}
          </Typography>
          {maxPages !== minPages ? (
          <Slider
            valueLabelDisplay="auto"
            step={1}
            marks
            min={minPages}
            onChange={handleSizeSlicer}
            value={usedPageCount}
            max={maxPages}
            disabled={animatedTimer !== undefined}
          />
          ) : undefined}
        </Box>
      </Collapse>
      <Collapse in={true}>
        <Stack direction="row" justifyContent="center" spacing={1} mt={1}>
          <CopyToClipboard text={copyValue}>
            <IconButton>
              <ContentCopyOutlined />
            </IconButton>
          </CopyToClipboard>
          <IconButton disabled={true}>
            <DownloadOutlined />
          </IconButton>
          <ToggleIconButton
            selected={playing}
            onClick={handlePlaying}
            disabled={maxPages <= 1}
          >
            {playing ? <PauseCircleOutline /> : <PlayCircleOutline />}
          </ToggleIconButton>
          <ToggleIconButton
            selected={showConfig && !playing}
            disabled={playing}
            onClick={() => setShowConfig(!showConfig)}
          >
            <ZoomIn />
          </ToggleIconButton>
        </Stack>
      </Collapse>
    </Card>
  );
  return (
    <Box>
      {props.children}
      <Box
        sx={{
          width: 300,
          height: 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mx: 'auto',
          mt: 2,
          border: '1px solid #ddd'
        }}
      >
        <QRCodeSVG value={value} />
      </Box>
      {pageCount > 1 ? (
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={index}
          nextButton={
            <Button
              size="small"
              onClick={() => setIndex(index + 1)}
              disabled={index === maxSteps - 1}
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
              onClick={() => setIndex(index - 1)}
              disabled={index === 0}
              variant="text"
              fullWidth={false}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      ) : null}
      {maxPages !== minPages ? (
        <Alert severity="info" icon={false}>
          <strong>Page Count-</strong>If your scanner can not scan the QR code,
          you can split data in more pages.
          <Box px={2} paddingLeft={4} paddingRight={4}>
            <Slider
              valueLabelDisplay="auto"
              step={1}
              marks
              min={minPages}
              onChange={handleSizeSlicer}
              value={usedPageCount}
              max={maxPages}
            />
          </Box>
        </Alert>
      ) : null}
      <CopyToClipboard text={copyValue}>
        <Button variant="outlined" startIcon={<ContentCopyOutlined />}>
          Copy to Clipboard
        </Button>
      </CopyToClipboard>
    </Box>
  );
};

export default DisplayQRCode;
