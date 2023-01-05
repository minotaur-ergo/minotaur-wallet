import React, { useState } from 'react';
import QrCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Container,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../store/actions';
import { MessageEnqueueService } from '../../app/MessageHandler';
import bs58 from 'bs58';
import { Action, Dispatch } from 'redux';

interface ExtendedPublicKeyViewPropsType extends MessageEnqueueService {
  extended: string;
}

const ExtendedPublicKeyView = (props: ExtendedPublicKeyViewPropsType) => {
  const [encoding, setEncoding] = useState<'hex' | 'base58' | 'base64'>(
    'base58'
  );
  const getDecoded = () => {
    if (encoding === 'base58') return props.extended;
    const decoded = Buffer.from(bs58.decode(props.extended));
    return decoded.toString(encoding);
  };
  return (
    <Container style={{ textAlign: 'center' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>
            Here you can see your wallet extended public key. using this key you
            can derive all addresses in readonly minotaur wallet.
          </Typography>
          <Typography color="secondary">
            keep is secret for your privacy
          </Typography>
          <br />
        </Grid>
        <Grid item xs={12}>
          <ToggleButtonGroup
            color="primary"
            size="medium"
            style={{ width: '100%' }}
            value={encoding}
            exclusive
            onChange={(event, newEncoding) => setEncoding(newEncoding)}
          >
            {['hex', 'base58', 'base64'].map((item, index) => (
              <ToggleButton
                key={index}
                style={{ width: `33.33%` }}
                value={item}
              >
                {item}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {props.extended ? <QrCode value={getDecoded()} size={256} /> : null}
        </Grid>
        <Grid item xs={12}>
          <CopyToClipboard
            text={getDecoded()}
            onCopy={() => props.showMessage('Copied', 'success')}
          >
            <div style={{ margin: 20, wordWrap: 'break-word' }}>
              {getDecoded()}
            </div>
          </CopyToClipboard>
        </Grid>
        <br />
        <br />
      </Grid>
    </Container>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExtendedPublicKeyView);
