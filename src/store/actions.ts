import * as actionType from './actionType';
import { SnackbarMessage, VariantType } from 'notistack';
import { DisplayType } from './reducer/wallet';
import { ConfigDbAction } from '../action/db';
import { ConfigType } from '../db/entities/Config';
import { Dispatch } from 'redux';

export const closeQrCodeScanner = (scannerId: string) => ({
  type: actionType.QRCODE_REMOVE,
  payload: scannerId,
});

export const AddQrCodeOpened = (scannerId: string) => ({
  type: actionType.QRCODE_ADD,
  payload: scannerId,
});

export const showMessage = (
  message: SnackbarMessage,
  variant: VariantType
) => ({
  type: actionType.ENQUEUE_MESSAGE,
  payload: {
    message: message,
    variant: variant,
  },
});

export const cleanMessage = () => ({
  type: actionType.ENQUEUE_MESSAGE,
  payload: {
    message: '',
    variant: 'default',
  },
});

export const loadConfig = () => {
  return (dispatch: Dispatch<any>) => {
    ConfigDbAction.getAllConfig().then((configs) => {
      const display = configs.filter(
        (config) => config.key === ConfigType.DisplayMode
      );
      if (display.length > 0) {
        const config = display[0];
        dispatch({
          type: actionType.SET_DISPLAY_MODE,
          payload: config.value === 'advanced' ? 'advanced' : 'simple',
        });
      }
    });
  };
};

export const setDisplayMode = (mode: DisplayType) => {
  return (dispatch: Dispatch<any>) => {
    ConfigDbAction.setConfig(ConfigType.DisplayMode, mode).then((res) => {
      dispatch({
        type: actionType.SET_DISPLAY_MODE,
        payload: mode,
      });
    });
  };
};
