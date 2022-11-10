import React, { useState } from 'react';
import Wallet from '../../db/entities/Wallet';
import { UnsignedGeneratedTx } from '../../util/interface';
import { BlockChainAction } from '../../action/blockchain';
import { getNetworkType } from '../../util/network_type';
import { GlobalStateType } from '../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../store/actions';
import { MessageEnqueueService } from '../app/MessageHandler';
import { Button, Container, Grid } from '@mui/material';
import { Browser } from '@capacitor/browser';
import DisplayId from '../display-id/DisplayId';
import PasswordInput from '../inputs/PasswordInput';
import { AddressAction } from '../../action/action';

interface SendConfirmPropsType extends MessageEnqueueService {
  close: () => any;
  wallet: Wallet;
  completed?: (txId: string) => any;
  transaction?: UnsignedGeneratedTx;
  display: boolean;
}

const SendConfirmMultiSig = (props: SendConfirmPropsType) => {
  const [password, setPassword] = useState('');
  const [txResponse, setTxResponse] = useState('');
  const sendTx = () => {
    if (props.transaction) {
      try {
        BlockChainAction.signTx(props.wallet, props.transaction, password)
          .then((signedTx) => {
            const node = getNetworkType(props.wallet.network_type).getNode();
            node
              .sendTx(signedTx)
              .then((result) => {
                setTxResponse(result.txId);
                if (props.completed) {
                  props.completed(result.txId);
                }
              })
              .catch((error) => {
                props.showMessage(`${error}`, 'error');
              });
            setPassword('');
          })
          .catch((error) => {
            props.showMessage(`${error}`, 'error');
          });
      } catch (exp) {
        console.log(exp);
      }
    }
  };
  const passwordValid = () => {
    return AddressAction.validatePassword(props.wallet, password);
  };
  const network_type = getNetworkType(props.wallet.network_type);
  return (
    <Container>
      <Grid container spacing={2}>
        {txResponse ? (
          <Grid item xs={12}>
            <br />
            Your transaction is generated and submitted to network.
            <br />
            <br />
            <div
              onClick={() =>
                Browser.open({
                  url: `${network_type.explorer_front}/en/transactions/${txResponse}`,
                })
              }
            >
              <DisplayId id={txResponse} />
            </div>
            <br />
            It can take about 2 minutes to mine your transaction. also syncing
            your wallet may be slow
            <br />
            <br />
          </Grid>
        ) : (
          <React.Fragment>
            <Grid item xs={12}>
              <br />
              Please enter your mnemonic passphrase to send transaction
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                size={'small'}
                label="Wallet password"
                error=""
                password={password}
                setPassword={setPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={sendTx}
                disabled={!(props.transaction && passwordValid())}
              >
                Send
              </Button>
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendConfirmMultiSig);
