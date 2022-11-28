import React from 'react';
import { Button, Grid } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { MessageEnqueueService } from '../app/MessageHandler';
import { connect } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../store/actions';
import { Action, Dispatch } from 'redux';

interface ClipboardTransferPropsType extends MessageEnqueueService {
  requestData: string;
}

const ClipboardTransfer = (props: ClipboardTransferPropsType) => {
  const copyText = () => {
    props.showMessage('Copied!!', 'info');
  };
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <CopyToClipboard text={props.requestData} onCopy={copyText}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={() => null}
          >
            <FontAwesomeIcon icon={faCopy} />
            &nbsp;&nbsp; Copy Data To Clipboard
          </Button>
        </CopyToClipboard>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClipboardTransfer);
