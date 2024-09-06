import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import TransactionBoxes from '@/components/sign/transaction-boxes/TransactionBoxes';
import StateMessage from '@/components/state-message/StateMessage';
import TxDisplay from '@/components/tx/TxDisplay';
import useTransactionData from '@/hooks/useTransactionData';
import SvgIcon from '@/icons/SvgIcon';
import AppFrame from '@/layouts/AppFrame';
import { StateWallet } from '@/store/reducer/wallet';
import { CircularProgress, IconButton } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface TransactionDetailsPropsType {
  wallet: StateWallet;
}

const WalletTransactionDetails = (props: TransactionDetailsPropsType) => {
  const { txId } = useParams<{ txId: string }>();
  const { tx, boxes, date, loading } = useTransactionData(
    txId ?? '',
    props.wallet,
  );
  const [displayBoxes, setDisplayBoxes] = useState(false);
  return (
    <AppFrame
      title="Transaction"
      navigation={<BackButtonRouter />}
      actions={
        tx ? (
          <IconButton onClick={() => setDisplayBoxes(!displayBoxes)}>
            <InventoryIcon />
          </IconButton>
        ) : undefined
      }
    >
      {loading ? (
        <StateMessage
          title="Loading Transaction"
          description="Please wait"
          icon={<CircularProgress />}
          color={`primary.dark`}
          disableIconShadow={true}
        />
      ) : tx ? (
        <React.Fragment>
          <TxDisplay wallet={props.wallet} boxes={boxes} tx={tx} date={date} />
          <TransactionBoxes
            open={displayBoxes}
            handleClose={() => setDisplayBoxes(false)}
            boxes={boxes}
            wallet={props.wallet}
            signed={tx}
          />
        </React.Fragment>
      ) : (
        <StateMessage
          title="Transaction Not Found"
          description="Transaction Not Found!!"
          icon={
            <SvgIcon icon="error" color="error" style={{ marginBottom: -8 }} />
          }
          color={`error.dark`}
        />
      )}
    </AppFrame>
  );
};

export default WalletTransactionDetails;
