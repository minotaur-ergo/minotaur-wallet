import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DisplayId from '../display-id/DisplayId';
import { GlobalStateType } from "../../store/reducer";
import { connect, MapDispatchToProps } from "react-redux";
import { showMessage } from "../../store/actions";
import { SnackbarMessage, VariantType } from "notistack";
import { MessageEnqueueService } from "../app/MessageHandler";

interface CopyableAddressPropsType extends MessageEnqueueService {
    address?: string;
}

const CopyableAddress = (props: CopyableAddressPropsType) => {
    const copyText = () => {
        props.showMessage("Copied!!", "info");
    }
    return (
        <>
            <CopyToClipboard text={props.address ? props.address : ""} onCopy={copyText}>
                <FontAwesomeIcon style={{float: "right"}} icon={faCopy}/>
            </CopyToClipboard>
            <DisplayId id={props.address}/>
        </>
    )
}


const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant))
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyableAddress);
