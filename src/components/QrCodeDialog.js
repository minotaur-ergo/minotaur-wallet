import React from "react";
import { Container, Dialog, DialogTitle } from "@material-ui/core";
import QrCode from 'qrcode.react';

const QrCodeDialog = props => {
  return (
    <Dialog onClose={props.onClose} onBackdropClick={props.onClose}  open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <Container>
        <QrCode value={props.value} size={256}/>
      </Container>
    </Dialog>
  )
}


export default QrCodeDialog;
