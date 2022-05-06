import * as actionType from "./actionType";
import { SnackbarMessage, VariantType } from "notistack";
import { DisplayType } from "./reducer/wallet";

export const closeQrCodeScanner = (scannerId: string) => ({
    type: actionType.QRCODE_REMOVE,
    payload: scannerId
});

export const AddQrCodeOpened = (scannerId: string) => ({
    type: actionType.QRCODE_ADD,
    payload: scannerId
});


export const showMessage = (message: SnackbarMessage, variant: VariantType) => ({
    type: actionType.ENQUEUE_MESSAGE,
    payload: {
        message: message,
        variant: variant
    }
});

export const cleanMessage = () => ({
    type: actionType.ENQUEUE_MESSAGE,
    payload: {
        message: "",
        variant: "default"
    }
});


export const setDisplayMode = (mode: DisplayType) => ({
    type: actionType.SET_DISPLAY_MODE,
    payload: mode
})
