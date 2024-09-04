import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import TransactionBoxes from '@/components/sign/transaction-boxes/TransactionBoxes';
import useTransactionData from '@/hooks/useTransactionData';
import AppFrame from '@/layouts/AppFrame';
import TxSignValues from '@/pages/wallet-page/send/sign-tx/TxSignValues';
import { StateWallet } from '@/store/reducer/wallet';
import { IconButton } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface TransactionDetailsPropsType {
  // txId: string;
  wallet: StateWallet;
}

const WalletTransactionDetails = (props: TransactionDetailsPropsType) => {
  const { txId } = useParams<{ txId: string }>();
  const txData = useTransactionData(txId ?? '', props.wallet);
  const [displayBoxes, setDisplayBoxes] = useState(false);
  return (
    <AppFrame
      title="Transaction"
      navigation={<BackButtonRouter />}
      actions={
        <IconButton>
          <InventoryIcon onClick={() => setDisplayBoxes(!displayBoxes)} />
        </IconButton>
      }
    >
      {txData.tx ? (
        <React.Fragment>
          <TxSignValues
            tx={txData.tx}
            boxes={txData.boxes}
            wallet={props.wallet}
            date={txData.date}
          />
          <TransactionBoxes
            open={displayBoxes}
            handleClose={() => setDisplayBoxes(false)}
            boxes={txData.boxes}
            wallet={props.wallet}
            signed={txData.tx}
          />
        </React.Fragment>
      ) : undefined}
      {/*<Typography fontSize="2rem" textAlign="center" color={color} mb={2}>*/}
      {/*  {transaction.amount}*/}
      {/*  <Typography component="span" ml={1}>*/}
      {/*    ERG*/}
      {/*  </Typography>*/}
      {/*</Typography>*/}
    </AppFrame>
  );
};

export default WalletTransactionDetails;
