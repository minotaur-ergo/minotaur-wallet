import React from 'react';
import { useSelector } from 'react-redux';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { GlobalStateType, StateWallet } from '@minotaur-ergo/types';
import { getValueColor } from '@minotaur-ergo/utils';
import { OpenInNew } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';

import { openTxInBrowser } from '@/action/tx';
import ErgAmount from '@/components/amounts-display/ErgAmount';
import useIssuedAndBurntTokens from '@/hooks/useIssuedAndBurntTokens';
import useTxValues from '@/hooks/useTxValues';
import TxAssetDetail from '@/pages/wallet-page/transaction/TxAssetDetail';

interface TxDisplayPropsType {
  wallet: StateWallet;
  tx: wasm.Transaction | wasm.UnsignedTransaction;
  boxes: Array<wasm.ErgoBox>;
  date?: string;
}

const TxDisplay = ({ tx, boxes, wallet, date }: TxDisplayPropsType) => {
  const hideBalances = useSelector(
    (state: GlobalStateType) => state.config.hideBalances,
  );
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
          showBalances={!hideBalances}
        />
        <Typography component="span" ml={1}>
          ERG
        </Typography>
      </Typography>
      {date ? (
        <React.Fragment>
          <Typography variant="body2" color="textSecondary">
            Date
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
        <React.Fragment key={item[0]}>
          <TxAssetDetail
            amount={mapped.get(item[0]) ?? 0n}
            id={item[0]}
            networkType={wallet.networkType}
            issueAndBurn={true}
          />
          <TxAssetDetail
            amount={-item[1] - (mapped.get(item[0]) ?? 0n)}
            id={item[0]}
            networkType={wallet.networkType}
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default TxDisplay;
