import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

const useQrReader = (
  scannedCallback: (scanned: string) => unknown,
  errorCallback: (error: unknown) => unknown,
  // preferred camera; when it is missing or fails to start another one is used
  deviceId: string = '',
  // called when no camera could be started at all
  startErrorCallback: (error: unknown) => unknown = errorCallback,
) => {
  // stopping a scanner clears the shared video element, so a new scanner
  // starts only after the previous one has finished starting (and stopping)
  const starting: MutableRefObject<Promise<unknown>> = useRef(
    Promise.resolve(),
  );
  // kept in a ref so a new callback identity does not restart the camera
  const startError = useRef(startErrorCallback);
  startError.current = startErrorCallback;
  const [cameras, setCameras] = useState<Array<string>>([]);
  const [rearCamera, setRearCamera] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let controls: IScannerControls | undefined;
    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: 200,
    });
    // cameras that started without video, so the fallback does not retry them
    const failed = new Set<string>([deviceId]);
    const startCamera = async (video: MediaTrackConstraints) => {
      const started = await codeReader.decodeFromConstraints(
        { video },
        'qr-code-scanner-video',
        (result, error) => {
          if (result) scannedCallback(result.getText());
          if (error) errorCallback(error);
        },
      );
      // when the OS blocks the camera (e.g. macOS privacy settings) the
      // stream starts without any error but never delivers a frame
      if (!(await waitForFrame(FIRST_FRAME_TIMEOUT))) {
        const failedId = getStreamSettings()?.deviceId;
        if (failedId) failed.add(failedId);
        started.stop();
        throw new Error('the camera did not deliver any video');
      }
      return started;
    };
    const start = starting.current
      .then(async () => {
        if (cancelled) return undefined;
        try {
          return await startCamera(
            deviceId ? { deviceId } : { facingMode: 'user' },
          );
        } catch (error) {
          // a denied permission fails for every camera; anything else (e.g. the
          // camera is used by another app) may work with another camera
          if (isPermissionError(error)) throw error;
          const devices = await navigator.mediaDevices.enumerateDevices();
          for (const device of devices) {
            if (cancelled) return undefined;
            if (device.kind !== 'videoinput' || !device.deviceId) continue;
            if (failed.has(device.deviceId)) continue;
            try {
              return await startCamera({
                deviceId: { exact: device.deviceId },
              });
            } catch (e) {
              console.log(`camera ${device.label} failed: ${e}`);
            }
          }
          throw error;
        }
      })
      .then((started) => {
        if (!started) return;
        if (cancelled) {
          started.stop();
          return;
        }
        console.log('initialized');
        controls = started;
        // desktop webcams usually report no facing mode, so only back cameras count
        setRearCamera(getStreamSettings()?.facingMode === 'environment');
        // device ids are only listed once the camera permission is granted
        return (
          navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
              if (cancelled) return;
              setCameras(
                devices
                  .filter(
                    (device) => device.kind === 'videoinput' && device.deviceId,
                  )
                  .map((device) => device.deviceId),
              );
            })
            // the camera is running; without the list only switching is unavailable
            .catch((error) => console.log(`failed to list cameras: ${error}`))
        );
      })
      .catch((error) => {
        console.log(`error ${error}`);
        if (!cancelled) startError.current(error);
      });
    starting.current = start;
    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [scannedCallback, errorCallback, deviceId]);
  // the camera actually streaming, which may differ from the preferred one
  const activeCamera = useCallback(
    () => getStreamSettings()?.deviceId ?? deviceId,
    [deviceId],
  );
  return { cameras, activeCamera, rearCamera };
};

export const isPermissionError = (error: unknown) =>
  error instanceof DOMException &&
  (error.name === 'NotAllowedError' || error.name === 'SecurityError');

const FIRST_FRAME_TIMEOUT = 5000;

const getVideo = () =>
  document.getElementById('qr-code-scanner-video') as HTMLVideoElement | null;

const getStreamSettings = () => {
  const stream = getVideo()?.srcObject as MediaStream | null | undefined;
  return stream?.getVideoTracks()[0]?.getSettings();
};

// resolves true once the scanner video has a frame, false after the timeout
const waitForFrame = (timeout: number) =>
  new Promise<boolean>((resolve) => {
    const video = getVideo();
    if (!video || video.videoWidth > 0) {
      resolve(!!video);
      return;
    }
    const done = (hasFrame: boolean) => {
      clearTimeout(timer);
      video.removeEventListener('loadeddata', onFrame);
      resolve(hasFrame);
    };
    const onFrame = () => done(true);
    const timer = setTimeout(() => done(video.videoWidth > 0), timeout);
    video.addEventListener('loadeddata', onFrame);
  });

export default useQrReader;
