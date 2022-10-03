import React, { useEffect, useState } from 'react';
import QrCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AddressWithErg from '../../../db/entities/views/AddressWithErg';
import { AddressDbAction } from '../../../action/db';
import { Button, Container, Grid } from '@mui/material';
import TextInput from '../../inputs/TextInput';
import { MessageEnqueueService } from '../../app/MessageHandler';
import { GlobalStateType } from '../../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../store/actions';

interface AddressViewPropsType extends MessageEnqueueService {
  address: AddressWithErg;
  invalidate: () => any;
}

const AddressView = (props: AddressViewPropsType) => {
  const [name, setName] = useState({ name: props.address.name, id: -1 });
  const updateName = () => {
    AddressDbAction.updateAddressName(props.address.id, name.name).then(
      (item) => {
        props.invalidate();
      }
    );
  };
  useEffect(() => {
    if (name.id !== props.address.id) {
      setName({ name: props.address.name, id: props.address.id });
    }
  }, [name.id, props.address.id, props.address.name]);
  return (
    <Container style={{ textAlign: 'center' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextInput
            label="Address Name"
            error={name.name === '' ? 'Name is required' : ''}
            value={name.name}
            setValue={(newName) => {
              setName({ ...name, name: newName });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {props.address.address ? (
            <QrCode value={props.address.address} size={256} />
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <CopyToClipboard
            text={props.address.address}
            onCopy={() => props.showMessage('Copied', 'success')}
          >
            <div style={{ margin: 20, wordWrap: 'break-word' }}>
              {props.address.address}
            </div>
          </CopyToClipboard>
        </Grid>
        <Grid item xs={12}>
          <div style={{ margin: 20, wordWrap: 'break-word' }}>
            Derivation path: {props.address.path}
          </div>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={name.name === '' || name.id === -1}
            onClick={() => updateName()}
          >
            Update address name
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressView);
