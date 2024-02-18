import { Box, styled } from '@mui/material';

const ScanQrBox = styled(Box)(() => ({
  position: 'relative',
  width: '80%',
  boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.3)',
  aspectRatio: '1/1',
  border: '1px solid #fff',
  zIndex: 1,
  marginBottom: '-100vh',
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

export default ScanQrBox;
