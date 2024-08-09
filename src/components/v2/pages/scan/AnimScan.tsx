import React, { useEffect, useMemo, useState } from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Box, Typography, IconButton } from '@mui/material';
import {
  CheckCircleOutline,
  ErrorOutlineOutlined,
  QrCodeScannerOutlined,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { CameraBox, DemoScanQR } from './Scan';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';

interface PropsType {
  changeMode: () => void;
}

const StatusBox = ({ value, scan }: { value?: boolean; scan: () => void }) => {
  if (value === true)
    return (
      <Box p={1} display="flex" color="success.light">
        <CheckCircleOutline />
      </Box>
    );
  if (value === false)
    return (
      <IconButton color="warning" onClick={scan}>
        <ErrorOutlineOutlined />
      </IconButton>
    );
  return (
    <Box p={1} display="flex">
      <RadioButtonUnchecked />
    </Box>
  );
};

const AnimScan = ({ changeMode }: PropsType) => {
  const navigate = useNavigate();
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timer>();
  const [hint, setHint] = useState<string>('');
  const [step, setStep] = useState(0);
  const [scanning, setScanning] = useState<boolean>(true);
  const [pagesStatus, setPagesStatus] = React.useState<(boolean | undefined)[]>(
    []
  );

  const isStarted = useMemo(() => pagesStatus.length > 0, [pagesStatus]);

  const setStatus = (index: number) =>
    setPagesStatus((prevState) => {
      const newState = [...prevState];
      newState[index] = Math.random() > 0.1 ? true : false;
      return newState;
    });
  const handleScanPage = (index: number) => () => {
    setScanning(true);
    setStep(index);
    setTimeout(() => {
      setStatus(index);
      setScanning(false);
    }, Math.random() * 2000);
  };

  useEffect(() => {
    setTimeout(() => {
      const count = 3 + Math.ceil(Math.random() * 17);
      setPagesStatus(Array(count).fill(undefined));
      console.log('xxx start', { pagesStatus });
      setTimeInterval(
        setInterval(() => {
          console.log('xxx next');
          setStep((prevState) => prevState + 1);
        }, 333)
      );
    }, Math.random() * 2000);
  }, []);

  useEffect(() => {
    if (isStarted) {
      setStatus(step - 1);
      if (step === pagesStatus.length) {
        console.log('xxx finish', { pagesStatus });
        clearInterval(timeInterval);
        setScanning(false);
        if (pagesStatus.some((i) => i === false))
          setHint(
            'Scanning of some pages failed. Click on these failed pages to rescan them.'
          );
      }
    }
  }, [step]);

  useEffect(() => {
    if (isStarted) {
      if (pagesStatus.every((i) => i === true)) navigate(RouterMap.Home);
    }
  }, [pagesStatus]);

  return (
    <AppFrame
      title="Scan QR Animation"
      navigation={<BackButton />}
      actions={
        <IconButton onClick={changeMode}>
          <QrCodeScannerOutlined />
        </IconButton>
      }
      toolbar={
        <Box color="common.white" textAlign="center" p={3}>
          <Typography color="warning.light" mb={3}>
            {hint}
          </Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {pagesStatus.map((item, index) => (
              <StatusBox
                value={item}
                scan={handleScanPage(index)}
                key={index}
              />
            ))}
          </Box>
        </Box>
      }
    >
      <CameraBox>
        {/* Replace camera component with the following demo component */}
        <Typography mb={6} sx={{ visibility: scanning ? 'visible' : 'hidden' }}>
          Align the QR code within the frame to scan
        </Typography>
        <Typography mb={2} sx={{ visibility: scanning ? 'visible' : 'hidden' }}>
          Page {step + 1}
        </Typography>
        <DemoScanQR sx={{ visibility: scanning ? 'visible' : 'hidden' }}>
          <div className="line" />
        </DemoScanQR>
      </CameraBox>
    </AppFrame>
  );
};

export default AnimScan;
