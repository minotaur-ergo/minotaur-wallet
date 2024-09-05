import { openTxInBrowser } from '@/action/tx';
import ErgAmount from '@/components/amounts-display/ErgAmount';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import IssuedBurntTokenAmount from '@/components/token-amount/IssuedBurntTokenAmount';
import useIssuedAndBurntTokens from '@/hooks/useIssuedAndBurntTokens';
import useTransactionData from '@/hooks/useTransactionData';
import useTxValues from '@/hooks/useTxValues';
import AppFrame from '@/layouts/AppFrame';
import TxAssetDetail from '@/pages/wallet-page/transaction/TxAssetDetail';
import { StateWallet } from '@/store/reducer/wallet';
import { getValueColor } from '@/utils/functions';
import { OpenInNew } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface TransactionDetailsPropsType {
  // txId: string;
  wallet: StateWallet;
}

const WalletTransactionDetails = (props: TransactionDetailsPropsType) => {
  const { txId } = useParams<{ txId: string }>();
  const { tx, boxes, date, loading } = useTransactionData(
    txId ?? '',
    props.wallet,
  );
  const [displayBoxes, setDisplayBoxes] = useState(false);
  const issuedAndBurnt = useIssuedAndBurntTokens(tx, boxes);
  const { txValues } = useTxValues(tx, boxes, props.wallet);
  const openTx = () => openTxInBrowser(props.wallet.networkType, txId ?? '');
  console.log(txValues);
  return (
    <AppFrame
      title="Transaction"
      navigation={<BackButtonRouter />}
      actions={
        <IconButton onClick={() => setDisplayBoxes(!displayBoxes)}>
          <InventoryIcon />
        </IconButton>
      }
    >
      {loading ? (
        <div>loading</div>
      ) : tx ? (
        <React.Fragment>
          <Typography
            fontSize="2rem"
            textAlign="center"
            color={getValueColor(-txValues.total)}
            mb={2}
          >
            <ErgAmount
              amount={txValues.total > 0 ? txValues.total : -txValues.total}
            />
            <Typography component="span" ml={1}>
              ERG
            </Typography>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Received on
          </Typography>
          <Typography mb={2}>{date}</Typography>

          <div>
            <Typography variant="body2" color="textSecondary">
              Transaction Id
            </Typography>
            <Typography
              mb={2}
              sx={{ overflowWrap: 'anywhere' }}
              onClick={openTx}
            >
              {txId}
              <IconButton size="small">
                <OpenInNew />
              </IconButton>
            </Typography>
          </div>
          {Object.entries(txValues.tokens).map((item) => (
            <TxAssetDetail
              amount={-item[1]}
              id={item[0]}
              networkType={props.wallet.networkType}
              key={item[0]}
            />
          ))}
          {issuedAndBurnt.burnt.length > 0 ? (
            <React.Fragment>
              <Typography variant="body2" color="textSecondary" mt={2}>
                Burnt tokens
              </Typography>
              <Stack sx={{ mb: 2, mt: 1 }} gap={0.5}>
                {issuedAndBurnt.burnt.map((item) => (
                  <IssuedBurntTokenAmount
                    tokenId={item.tokenId}
                    amount={item.amount}
                    networkType={props.wallet.networkType}
                    color={'error'}
                  />
                ))}
              </Stack>
            </React.Fragment>
          ) : null}
          {issuedAndBurnt.issued.length > 0 ? (
            <React.Fragment>
              <Typography variant="body2" color="textSecondary" mt={2}>
                Issued tokens
              </Typography>
              <Stack sx={{ mb: 2, mt: 1 }} gap={0.5}>
                {issuedAndBurnt.issued.map((item) => (
                  <IssuedBurntTokenAmount
                    tokenId={item.tokenId}
                    amount={item.amount}
                    networkType={props.wallet.networkType}
                    color={'success'}
                  />
                ))}
              </Stack>
            </React.Fragment>
          ) : null}
        </React.Fragment>
      ) : (
        <div>not found</div>
      )}
    </AppFrame>
  );
};

export default WalletTransactionDetails;
