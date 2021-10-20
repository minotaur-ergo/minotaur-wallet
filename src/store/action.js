import * as actionTypes from './actionType';
import { loadWalletAddress } from "../db/action/Address";
import { store } from "./index";
import { useEffect, useState } from "react";
import { loadWallet } from "../db/action/Wallet";

export const set_wallet = index => (dispatch, getState) => {
    const state = getState();

}


export const loadAddresses = wallet => {
    const state = store.getState()
    const loadWalletAddresses = () => {
        if (wallet !== undefined && wallet.id !== undefined) {
            if (state.valid.address !== wallet.id) {
                loadWalletAddress(wallet.id).then(() => null)
            }
        }
    }
    if(!state.valid.wallet){
        loadWallets(loadWalletAddresses);
    }else{
        loadWalletAddresses();
    }
}


export const loadWallets = (callBack = () => {}) => {
    const state = store.getState()
    if (!state.valid.wallet) {
        loadWallet().then(() => callBack())
    }

}
