import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  ConfigType,
  GlobalStateType,
  QrCodePropsType,
} from '@minotaur-ergo/types';
import { CameraswitchOutlined } from '@mui/icons-material';
import { Fab } from '@mui/material';

import { ConfigDbAction } from '@/action/db';
import MessageContext from '@/components/app/messageContext';
import useQrReader, { isPermissionError } from '@/hooks/useQrReader';
import { setQrCamera } from '@/store/reducer/config';

interface QrCodeReaderWebPropsType extends QrCodePropsType {
  closeQrCode: () => unknown;
}

const QrCodeReaderWeb = (props: QrCodeReaderWebPropsType) => {
  const qrCamera = useSelector(
    (state: GlobalStateType) => state.config.qrCamera,
  );
  const activePinType = useSelector(
    (state: GlobalStateType) => state.config.pin.activePinType,
  );
  const dispatch = useDispatch();
  const message = useContext(MessageContext);
  const { closeQrCode } = props;
  // every camera failed: leave the scanner and tell the user why
  const startFailed = useCallback(
    (error: unknown) => {
      message.insert(
        isPermissionError(error)
          ? 'No permission to use camera'
          : 'Could not start the camera. Check that Minotaur has camera access in your system settings and that no other app is using it.',
        'error',
      );
      closeQrCode();
    },
    [message, closeQrCode],
  );
  const { cameras, activeCamera, rearCamera } = useQrReader(
    props.handleScan,
    props.handleError,
    qrCamera,
    startFailed,
  );
  // double tap flips the mirroring, for cameras whose facing is guessed wrong;
  // it goes back to automatic when the camera changes
  const [flipMirror, setFlipMirror] = useState(false);
  useEffect(() => setFlipMirror(false), [qrCamera]);
  useEffect(() => {
    const toggle = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, a, input')) return;
      setFlipMirror((flip) => !flip);
    };
    document.addEventListener('dblclick', toggle);
    return () => document.removeEventListener('dblclick', toggle);
  }, []);
  const mirrored = rearCamera === flipMirror;
  // switch to the next camera and remember it for the next scans
  const selectNext = () => {
    const active = activeCamera();
    const index = cameras.indexOf(active);
    let next = cameras[(index + 1) % cameras.length];
    // the saved camera failed and another one is showing: skip the failing one
    if (next === qrCamera && active !== qrCamera) {
      next = cameras[(index + 2) % cameras.length];
    }
    if (next === active) return;
    ConfigDbAction.getInstance()
      .setConfig(ConfigType.QrCamera, next, activePinType)
      .then(() => {
        dispatch(setQrCamera(next));
      });
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
          // mirror cameras facing the user; a back camera is shown as is
          transform: mirrored ? 'scaleX(-1)' : 'none',
          zIndex: -1,
        }}
      />
      <video />
      {cameras.length > 1 ? (
        // top left corner of the camera view, like the phone scanner
        <Fab
          onClick={selectNext}
          sx={{ position: 'fixed', top: 72 + 16, left: 16, zIndex: 1 }}
        >
          <CameraswitchOutlined />
        </Fab>
      ) : undefined}
    </React.Fragment>
  );
};

export default QrCodeReaderWeb;
