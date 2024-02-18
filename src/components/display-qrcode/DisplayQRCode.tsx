import { useState } from 'react';
import { Alert, Box, Button, MobileStepper, Slider } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { MAX_CHUNK_SIZE, QRCODE_MINIMUM_CHUNK_SIZE } from '@/utils/const';
import {
  ContentCopyOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
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
    dataSize / (MAX_CHUNK_SIZE - 10 - props.type.length),
  );
  const maxPages = Math.ceil(dataSize / QRCODE_MINIMUM_CHUNK_SIZE);
  const [pageCount, setPageCount] = useState(minPages);
  const usedPageCount = Math.max(Math.min(pageCount, maxPages), minPages);
  const size = Math.ceil(props.value.length / usedPageCount);
  const [index, setIndex] = useState(0);
  const chunk = props.value.substring(index * size, (index + 1) * size);
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
  });
  const copyValue = JSON.stringify({ [props.type]: props.value });
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
          border: '1px solid #ddd',
        }}
      >
        <QRCodeSVG value={value} size={512} />
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
