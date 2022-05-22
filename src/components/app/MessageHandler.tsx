import React, { useEffect, useState } from "react";
import { GlobalStateType } from "../../store/reducer";
import { connect, MapDispatchToProps } from "react-redux";
import { cleanMessage } from "../../store/actions";
import { SnackbarMessage, useSnackbar, VariantType } from "notistack";

interface MessageHandlerPropsType {
    message: SnackbarMessage;
    variant: VariantType;
    cleanMessage: () => any;
}

export interface MessageEnqueueService {
    showMessage: (message: SnackbarMessage, variant: VariantType) => any;
}

const MessageHandler = (props: MessageHandlerPropsType) => {
    const [lastMessage, setLastMessage] = useState<SnackbarMessage>();
    const snackbar = useSnackbar();
    useEffect(() => {
        if (props.message !== lastMessage) {
            setLastMessage(props.message);
            if (props.message) {
                snackbar.enqueueSnackbar(props.message, {variant: props.variant, anchorOrigin: {vertical: "top", horizontal: "center"}});
                props.cleanMessage();
            }
        }
    }, [lastMessage, props, snackbar])
    return <React.Fragment/>
}

const mapStateToProps = (state: GlobalStateType) => ({
    message: state.message.message,
    variant: state.message.variant
});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    cleanMessage: () => dispatch(cleanMessage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageHandler);
