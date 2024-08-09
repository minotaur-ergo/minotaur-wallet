import { useState } from 'react';
import { styled, Box, Typography, TypographyProps } from '@mui/material';
import SingleScan from './SingleScan';
import AnimScan from './AnimScan';

export const CameraBox = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: 'calc(100vh - 72px)',
  position: 'fixed',
  top: 72,
  left: 0,
  zIndex: '-1',
  backgroundColor: 'black', // Just for demo
  color: 'white',
  padding: theme.spacing(9, 3),
  boxSizing: 'border-box',
  textAlign: 'center',
}));

export const OverheadTypography = (props: TypographyProps) => {
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

export const DemoScanQR = styled(Box)(() => ({
  position: 'relative',
  width: '70%',
  aspectRatio: '1/1',
  border: '1px solid #fff',
  backgroundColor: '#ffffff11',
  margin: '0 auto',
  '& .line': {
    borderTop: '2px solid #fff',
    width: '100%',
    top: 0,
    position: 'absolute',
    animation: 'example 3s infinite linear',
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
  const [animScan, setAnimScan] = useState<boolean>(false);

  if (animScan) return <AnimScan changeMode={() => setAnimScan(false)} />;
  return <SingleScan changeMode={() => setAnimScan(true)} />;
};

export default Scan;
