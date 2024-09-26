import { openTxInBrowser } from '@/action/tx';
import ErgAmount from '@/components/amounts-display/ErgAmount';
import useIssuedAndBurntTokens from '@/hooks/useIssuedAndBurntTokens';
import useTxValues from '@/hooks/useTxValues';
import TxAssetDetail from '@/pages/wallet-page/transaction/TxAssetDetail';
import { StateWallet } from '@/store/reducer/wallet';
import { getValueColor } from '@/utils/functions';
import { OpenInNew } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
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
  const { mapped } = useIssuedAndBurntTokens(tx, boxes);
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
        <React.Fragment>
          <TxAssetDetail
            amount={mapped.get(item[0]) ?? 0n}
            id={item[0]}
            networkType={wallet.networkType}
            key={item[0]}
            issueAndBurn={true}
          />
          <TxAssetDetail
            amount={-item[1] - (mapped.get(item[0]) ?? 0n) }
            id={item[0]}
            networkType={wallet.networkType}
            key={item[0]}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default TxDisplay;
