import * as actionTypes from "../actionType";

export interface ScanResult {
    content: string;
    valid: boolean;
}

export interface QrCodeStateType {
    scan: ScanResult;
    show: boolean;
}


const apiInitialState: QrCodeStateType = {
    scan: {valid: false, content: ''},
    show: false,
};


export const reducer = (state = apiInitialState, action: { type: string, payload?: any }) => {
    switch (action.type) {
        case actionTypes.SET_SUCCESS_SCAN_RESULT:
            return {
                ...state,
                scan: {
                    valid: true,
                    content: action.payload,
                },
                show: false
            }
        case actionTypes.SET_FAIL_SCAN_RESULT:
            return {
                ...state,
                scan: {
                    valid: false,
                    content: '',
                },
                show: false
            }
        case actionTypes.SET_SHOW_QRCODE_SCANNER:
            return {
                ...state,
                show: action.payload,
            }
    }
    return state;
};

export default reducer;
