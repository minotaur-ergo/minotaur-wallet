import { openTxInBrowser } from '@/action/tx';
import ErgAmount from '@/components/amounts-display/ErgAmount';
import IssuedBurntTokenAmount from '@/components/token-amount/IssuedBurntTokenAmount';
import useIssuedAndBurntTokens from '@/hooks/useIssuedAndBurntTokens';
import useTxValues from '@/hooks/useTxValues';
import TxAssetDetail from '@/pages/wallet-page/transaction/TxAssetDetail';
import { StateWallet } from '@/store/reducer/wallet';
import { getValueColor } from '@/utils/functions';
import { OpenInNew } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import * as wasm from 'ergo-lib-wasm-browser';

interface TxDisplayPropsType {
  wallet: StateWallet;
  tx: wasm.Transaction | wasm.UnsignedTransaction;
  boxes: Array<wasm.ErgoBox>;
  date?: string;
}

const TxDisplay = ({ tx, boxes, wallet, date }: TxDisplayPropsType) => {
  const txId = tx.id().to_str();
  const issuedAndBurnt = useIssuedAndBurntTokens(tx, boxes);
  const { txValues } = useTxValues(tx, boxes, wallet);
  const openTx = () => openTxInBrowser(wallet.networkType, txId ?? '');
  return (
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
      {date ? (
        <React.Fragment>
          <Typography variant="body2" color="textSecondary">
            Received on
          </Typography>
          <Typography mb={2}>{date}</Typography>
        </React.Fragment>
      ) : null}
      <div>
        <Typography variant="body2" color="textSecondary">
          Transaction Id
        </Typography>
        <Typography mb={2} sx={{ overflowWrap: 'anywhere' }} onClick={openTx}>
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
          networkType={wallet.networkType}
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
                key={item.tokenId}
                tokenId={item.tokenId}
                amount={item.amount}
                networkType={wallet.networkType}
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
                key={item.tokenId}
                tokenId={item.tokenId}
                amount={item.amount}
                networkType={wallet.networkType}
                color={'success'}
              />
            ))}
          </Stack>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default TxDisplay;
