import * as actionType from "./actionType";

export const closeQrCodeScanner = (scannerId: string) => ({
    type: actionType.QRCODE_REMOVE,
    payload: scannerId
});

export const AddQrCodeOpened = (scannerId: string) => ({
    type: actionType.QRCODE_ADD,
    payload: scannerId
});
