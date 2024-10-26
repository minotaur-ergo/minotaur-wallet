import useQrReader from '@/hooks/useQrReader';
import { QrCodePropsType } from '@/types/qrcode';
import { CameraswitchOutlined } from '@mui/icons-material';
import { Fab } from '@mui/material';
import React, { useState } from 'react';

interface QrCodeReaderWebPropsType extends QrCodePropsType {
  closeQrCode: () => unknown;
}

const QrCodeReaderWeb = (props: QrCodeReaderWebPropsType) => {
  const [selected, setSelected] = useState(0);
  const totalDevices = useQrReader(props.handleScan, props.handleError);
  const selectNext = () => {
    setSelected((selected + 1) % totalDevices);
  };
  return (
    <React.Fragment>
      <video
        id="qr-code-scanner-video"
        style={{
          width: '100%',
          height: '100vh',
          position: 'fixed',
          background: '#000',
          top: 0,
          left: 0,
          objectFit: 'cover',
          transform: 'scaleX(-1)',
        }}
      />
      {totalDevices > 1 ? (
        <Fab onClick={() => selectNext}>
          <CameraswitchOutlined />
        </Fab>
      ) : undefined}
    </React.Fragment>
  );
};

export default QrCodeReaderWeb;
