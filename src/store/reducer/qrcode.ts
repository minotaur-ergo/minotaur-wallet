import * as actionTypes from '../actionType';

export interface QrCodeStateType {
  pages: Array<string>;
}

export const apiInitialState: QrCodeStateType = {
  pages: [],
};

export const reducer = (
  state = apiInitialState,
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case actionTypes.QRCODE_ADD:
      return {
        ...state,
        pages: [...state.pages, action.payload],
      };
    case actionTypes.QRCODE_REMOVE:
      return {
        ...state,
        pages: state.pages.filter((item) => item !== action.payload),
      };
  }
  return state;
};

export default reducer;
