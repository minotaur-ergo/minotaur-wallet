import React from "react";
import { Browser } from "@capacitor/browser";

const SigmaUSDReadme = () => (
    <div style={{ textAlign: "justify" }}>
        <h3>What is SigmaUSD</h3>
        SigmaUSD is an instance of AgeUSD protocol on Ergo.
        <br />
        <br />
        AgeUSD is a novel crypto-backed algorithmic stablecoin protocol
        that has been created in joint partnership by the Ergo Foundation,
        EMURGO, and IOG on top of the Ergo Blockchain.
        <br />
        <br />
        Please note that this dApp itself is not the instance;
        it only interacts with the deployed contracts on Ergo blockchain
        which has been deployed by other anonymous community
        members not connected with Emurgo or EF.
        <br />
        <h3>Fees</h3>
        The SigmaUSD protocol fee parameter are:
        <br />
        <ol>
            <li>1% Protocol Fee</li>
            <li>0.2% Frontend Implementor Fee</li>
        </ol>
        The protocol fee is charged on all minting/redeeming actions in the protocol (for both AgeUSD & ReserveCoins).
        The Ergs from this fee go back to the protocol reserves, and as such profit the ReserveCoin holders directly. In
        other words, if you hold ReserveCoins, you are not only rewarded in the scenario that the price of Erg goes up,
        but also if a lot of people use the AgeUSD protocol. This provides further incentives for Reserve Providers to
        ensure sufficient liquidity is always available so AgeUSD users can always mint AgeUSD.
        <br />
        <br />
        The frontend implementor fee is the fee that gets paid out to the frontend implementor who built a GUI on top of
        the AgeUSD headless dApp. This fee payout is performed automatically as a part of every mint/redeem action.
        <br />
        <br />
        <b onClick={() => Browser.open({ url: `https://github.com/Emurgo/age-usd/blob/main/README.md` })}>
            Read more about AgeUSD protocol here
        </b>
    </div>
);
export const apps = [
    { name: "Issue Token", description: "Issue new token using EIP-004", id: "issueToken" },
    { name: "SigmaUSD", description: "Buy or sell SigmaUSD and SigmaRSV", readme: SigmaUSDReadme(), id: "sigmaUsd" }
];
