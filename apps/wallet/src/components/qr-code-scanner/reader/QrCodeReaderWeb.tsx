import React, { useState } from 'react';

import { QrCodePropsType } from '@minotaur-ergo/types';
import { CameraswitchOutlined } from '@mui/icons-material';
import { Fab } from '@mui/material';

import useQrReader from '@/hooks/useQrReader';

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
          width: '100vw',
          height: 'calc(100vh - 72px)',
          position: 'fixed',
          background: '#000',
          top: 72,
          left: 0,
          objectFit: 'cover',
          transform: 'scaleX(-1)',
          zIndex: -1,
        }}
      />
      <video />
      {totalDevices > 1 ? (
        <Fab onClick={() => selectNext}>
          <CameraswitchOutlined />
        </Fab>
      ) : undefined}
    </React.Fragment>
  );
};

export default QrCodeReaderWeb;
