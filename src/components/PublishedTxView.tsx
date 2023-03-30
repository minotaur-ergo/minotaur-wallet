import React from 'react';
import { Grid } from '@mui/material';
import { Browser } from '@capacitor/browser';
import DisplayId from './display-id/DisplayId';
import { NetworkType } from '../util/interface';
import openInBrowser from '../util/browser';

interface PublishedTxViewPropsType {
  txId: string;
  networkType: NetworkType;
}

const PublishedTxView = (props: PublishedTxViewPropsType) => {
  return (
    <Grid item xs={12}>
      <br />
      Your transaction published to network.
      {/*Your transaction is generated and submitted to network.*/}
      <br />
      {/*<br />*/}
      <div
        onClick={() =>
          openInBrowser(
            `${props.networkType.explorer_front}/en/transactions/${props.txId}`
          )
        }
      >
        <DisplayId id={props.txId} />
      </div>
      <br />
      It can take about 2 minutes to mine your transaction. also syncing your
      wallet may be slow
      <br />
    </Grid>
  );
};

export default PublishedTxView;
