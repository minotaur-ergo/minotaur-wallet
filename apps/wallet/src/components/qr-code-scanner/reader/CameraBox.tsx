import { Box, styled } from '@mui/material';

export const CameraBox = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: 'calc(100vh - 72px)',
  position: 'fixed',
  top: 72,
  left: 0,
  zIndex: '-1',
  // backgroundColor: 'black', // Just for demo
  color: 'white',
  padding: theme.spacing(9, 3),
  boxSizing: 'border-box',
  textAlign: 'center',
}));

export default CameraBox;
