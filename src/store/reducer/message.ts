import * as actionTypes from "../actionType";
import { SnackbarMessage, VariantType } from "notistack";

export interface EnqueueMessage {
    message: SnackbarMessage;
    variant: VariantType ;
}

export const apiInitialState: EnqueueMessage = {
    message: "",
    variant: "default"
};

export const reducer = (state = apiInitialState, action: { type: string, payload: EnqueueMessage }) => {
    switch (action.type) {
        case actionTypes.ENQUEUE_MESSAGE:
            return {
                ...state,
                message: action.payload.message,
                variant: action.payload.variant
            };
    }
    return state;
};

export default reducer;
