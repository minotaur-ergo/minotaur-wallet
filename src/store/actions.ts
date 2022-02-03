import * as actionType from "./actionType";
import { ScanResult } from "./reducer/qrcode";

export const failScanResult = () => ({ type: actionType.SET_FAIL_SCAN_RESULT });

export const successScanResult = (scanResult: string) => ({
    type: actionType.SET_SUCCESS_SCAN_RESULT,
    payload: scanResult
});

export const setQrCodeType = (qrCodeType: string, result: Array<ScanResult>) => ({
    type: actionType.SET_SCAN_RESULT_TYPE,
    payload: {
        type: qrCodeType,
        chunks: result
    },
})

export const showQrCodeScanner = () => ({ type: actionType.SET_SHOW_QRCODE_SCANNER, payload: true });

export const hideQrCodeScanner = () => ({ type: actionType.SET_SHOW_QRCODE_SCANNER, payload: false });

