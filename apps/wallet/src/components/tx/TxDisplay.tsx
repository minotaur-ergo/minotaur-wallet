import React, { useMemo } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet, TxStatus } from '@minotaur-ergo/types';
import { getValueColor } from '@minotaur-ergo/utils';
import { OpenInNew } from '@mui/icons-material';
import { Avatar, Box, IconButton, Typography } from '@mui/material';

import { openTxInBrowser } from '@/action/tx';
import ErgAmount from '@/components/amounts-display/ErgAmount';
import TransactionResult from '@/components/tx/TransactionResult';
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
  const txId = tx.id().to_str();
  const { mapped } = useIssuedAndBurntTokens(tx, boxes);
  const { txValues } = useTxValues(tx, boxes, wallet);
  const openTx = () => openTxInBrowser(wallet.networkType, txId ?? '');
  const tokensCount = useMemo(
    () =>
      Object.entries(txValues.tokens).filter(([_, balance]) => balance !== 0n)
        .length,
    [txValues.tokens],
  );
  return (
    <React.Fragment>
      <Box>
        <Box display="flex" justifyContent="center">
          <Avatar
            src="/ergo.svg"
            sx={{ width: '48px', height: '48px', borderRadius: '40px' }}
          />
        </Box>
        <Typography
          fontSize="2rem"
          textAlign="center"
          color={getValueColor(-txValues.total)}
        >
          <ErgAmount
            amount={txValues.total > 0 ? txValues.total : -txValues.total}
          />
          <Typography component="span" ml={1}>
            ERG
          </Typography>
        </Typography>
        <Box display="flex" justifyContent="center" mb={2}>
          <TransactionResult
            tx={{
              ergIn: 0n,
              ergOut: 0n,
              txId: txId,
              date: new Date(),
              tokens: new Map<string, bigint>(
                Object.entries(txValues.tokens).map(([tokenId, balance]) => [
                  tokenId,
                  -balance,
                ]),
              ),
            }}
            amount={-txValues.total}
            txType={TxStatus.IN}
            withBg={true}
          />
        </Box>
      </Box>
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
      {tokensCount > 0 && (
        <Typography variant="body2" color="textSecondary">
          Tokens{' '}
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              bgcolor: '#E0E0E0',
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '16px',
              letterSpacing: '0.16px',
              color: 'textSecondary',
            }}
          >
            {tokensCount}
          </Box>
        </Typography>
      )}
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
