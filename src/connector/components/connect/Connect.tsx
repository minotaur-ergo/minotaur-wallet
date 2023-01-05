import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import QrCode from 'qrcode.react';
import ReactLoading from 'react-loading';

interface ConnectPropsType {
  id: string;
  requestId: string | null;
  enc_key?: string;
  pageId: string;
  server: string;
  wallet_code?: string;
  origin?: string;
  favIcon?: string;
  display?: string;
  confirm: () => any;
}

const Connect = (props: ConnectPropsType) => {
  const connection = {
    server: props.server,
    id: props.id,
    requestId: props.requestId,
    enc_key: props.enc_key,
    pageId: props.pageId,
    origin: props.origin ? props.origin : '',
    favIcon: props.favIcon ? props.favIcon : '',
  };
  return (
    <Container>
      {props.display ? (
        <React.Fragment>
          <Typography>
            Please check this code with code displayed on your wallet.
            <br />
            <span style={{ letterSpacing: 8, display: 'block', padding: 10 }}>
              <span
                style={{
                  background: '#CDCDCD',
                  padding: 5,
                  fontWeight: 'bold',
                  fontSize: 20,
                  borderRadius: 10,
                }}
              >
                {props.display}
              </span>
            </span>
            <br />
            Is both codes are same?
          </Typography>
          <Button variant="contained" onClick={props.confirm}>
            Confirm
          </Button>
        </React.Fragment>
      ) : props.id ? (
        <React.Fragment>
          <Typography>
            Please Open your minotaur wallet.
            <br />
            Goto{' '}
            <b>
              DApps <span style={{ fontSize: '200%' }}>→</span> DApp Connector
            </b>
            <br />
            Then Scan QRCode below to connect to your wallet
          </Typography>
          <br />
          <QrCode value={JSON.stringify(connection)} size={256} />
        </React.Fragment>
      ) : (
        <ReactLoading className={'loading'} type={'spin'} color="black" />
      )}
    </Container>
  );
};

export default Connect;
