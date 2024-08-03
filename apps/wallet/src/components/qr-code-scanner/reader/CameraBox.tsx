import { Box, styled } from '@mui/material';

const CameraBox = styled(Box)(() => ({
  width: '100vw',
  height: 'calc(100vh - 72px)',
  position: 'fixed',
  top: 72,
  left: 0,
}));

export default CameraBox;
