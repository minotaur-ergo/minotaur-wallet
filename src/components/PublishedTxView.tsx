import React from 'react';
import { Grid } from '@mui/material';
import { Browser } from '@capacitor/browser';
import DisplayId from './display-id/DisplayId';
import { NetworkType } from '../util/interface';

interface PublishedTxViewPropsType {
    txId: string;
    networkType: NetworkType
}

const PublishedTxView = (props: PublishedTxViewPropsType)=>{
    return (
        <Grid item xs={12}>
            <br/>
            Your transaction is generated and submitted to network.
            <br/>
            <br/>
            <div
                onClick={() => Browser.open({url: `${props.networkType.explorer_front}/en/transactions/${props.txId}`})}>
                <DisplayId id={props.txId}/>
            </div>
            <br/>
            It can take about 2 minutes to mine your transaction. also syncing your wallet may be slow
            <br/>
            <br/>
        </Grid>
    )
}

export default PublishedTxView;