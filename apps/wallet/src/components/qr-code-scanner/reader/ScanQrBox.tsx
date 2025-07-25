import { Box, styled } from '@mui/material';

const ScanQrBox = styled(Box)(() => ({
  'position': 'relative',
  'width': '80%',
  'aspectRatio': '1/1',
  'border': '1px solid #fff',
  'boxShadow': 'rgba(0, 0, 0, 0.3) 0px 0px 0px 4000px',
  'backgroundColor': '#ffffff11',
  'margin': '120px auto 0',
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
