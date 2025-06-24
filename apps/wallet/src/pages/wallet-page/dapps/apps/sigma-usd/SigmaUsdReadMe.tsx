import React from 'react';

import { Button, Typography } from '@mui/material';

import openInBrowser from '@/utils/browser';

const SigmaUsdReadMe = () => {
  const openLink = () => {
    openInBrowser(`https://github.com/Emurgo/age-usd/blob/main/README.md`);
  };
  return (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        What is SigmaUSD
      </Typography>
      <Typography gutterBottom>
        SigmaUSD is an instance of ageUSD protocol on Ergo.
      </Typography>
      <Typography gutterBottom>
        AgeUSD is a novel crypto-backed algorithmic stablecoin protocol that has
        been created in joint partnership by the Ergo Foundation, EMURGO, and
        IOG on top of the Ergo Blockchain.
      </Typography>
      <Typography gutterBottom>
        Please note that this dApp itself is not the instance; it only interacts
        with the deployed contracts on Ergo blockchain which has been deployed
        by other anonymous community members not connected with Emurgo or EF.
      </Typography>

      <Typography variant="h2" gutterBottom sx={{ mt: 2 }}>
        Fees
      </Typography>
      <Typography gutterBottom>
        The SigmaUSD protocol fee parameter are:
      </Typography>
      <ul style={{ margin: 0 }}>
        <li>1% Protocol Fee</li>
        <li>0.2% Frontend Implementor Fee</li>
      </ul>
      <Typography gutterBottom>
        The protocol fee is charged on all minting/redeeming actions in the
        protocol (for both AgeUSD & ReserveCoins). The Ergs from this fee go
        back to the protocol reserves, and as such profit the ReserveCoin
        holders directly. In other words, if you hold ReserveCoins, you are not
        only rewarded in the scenario that the price of Erg goes up, but also if
        a lot of people use the AgeUSD protocol. This provides further
        incentives for Reserve Providers to ensure sufficient liquidity is
        always available so AgeUSD users can always mint AgeUSD.
      </Typography>
      <Typography gutterBottom>
        The frontend implementor fee is the fee that gets paid out to the
        frontend implementor who built a GUI on top of the AgeUSD headless dApp.
        This fee payout is performed automatically as a part of every
        mint/redeem action.
      </Typography>
      <Button onClick={openLink} variant="text">
        Read more about AgeUSD protocol here
      </Button>
    </React.Fragment>
  );
};

export default SigmaUsdReadMe;
