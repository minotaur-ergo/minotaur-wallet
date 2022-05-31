import React from "react";
import { Button, Grid } from "@mui/material";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { MessageEnqueueService } from '../app/MessageHandler';
import { GlobalStateType } from '../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../store/actions';

interface ClipBoardTransferPropsType extends MessageEnqueueService{
    requestData: string;
}

const ClipBoardTransfer = (props: ClipBoardTransferPropsType) => {
    const copyText = () => {
        props.showMessage("Copied!!", "info");
    }
    return (
        <React.Fragment>
            <Grid item xs={12}>
                <CopyToClipboard text={props.requestData} onCopy={copyText}>
                    <Button variant='contained' fullWidth color='primary' onClick={() => null}>
                        <FontAwesomeIcon icon={faCopy}/>&nbsp;&nbsp;
                        Copy Data To Clipboard
                    </Button>
                </CopyToClipboard>
            </Grid>
        </React.Fragment>
    );
};

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant))
});

export default connect(mapStateToProps, mapDispatchToProps)(ClipBoardTransfer);
