import { openTxInBrowser } from '@/action/tx';
import useTxValues from '@/hooks/useTxValues';
import { Box, FormHelperText, IconButton, Typography } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { ErgoBox } from 'ergo-lib-wasm-browser';
import * as wasm from 'ergo-lib-wasm-browser';
import React from 'react';
import TokenAmount from '@/components/token-amount/TokenAmount';
import { StateWallet } from '@/store/reducer/wallet';
import useIssuedAndBurntTokens from '@/hooks/useIssuedAndBurntTokens';
import UnBalancedTokensAmount from '@/components/token-amount/UnBalancedTokensAmount';

interface WalletSignNormalPropsType {
  tx: wasm.UnsignedTransaction | wasm.Transaction;
  boxes: Array<ErgoBox>;
  wallet: StateWallet;
  date?: string;
}

const TxSignValues = (props: WalletSignNormalPropsType) => {
  const issuedAndBurnt = useIssuedAndBurntTokens(props.tx, props.boxes);
  const { txValues, valuesDirection } = useTxValues(
    props.tx,
    props.boxes,
    props.wallet,
  );
  const openTx = () =>
    openTxInBrowser(props.wallet.networkType, props.tx.id().to_str());
  return (
    <Box>
      {valuesDirection.outgoing ? (
        <React.Fragment>
          <Typography variant="body2" color="textSecondary">
            Total spent
          </Typography>
          {txValues.total > 0 ? (
            <TokenAmount
              tokenId={'erg'}
              amount={txValues.total}
              networkType={props.wallet.networkType}
            />
          ) : null}
          {Object.entries(txValues.tokens).map(([tokenId, value]) =>
            value > 0 ? (
              <TokenAmount
                tokenId={tokenId}
                amount={value}
                networkType={props.wallet.networkType}
                key={tokenId}
              />
            ) : null,
          )}
        </React.Fragment>
      ) : null}
      {valuesDirection.incoming ? (
        <React.Fragment>
          <Typography variant="body2" color="textSecondary">
            Total Income
          </Typography>
          {txValues.total < 0 ? (
            <TokenAmount
              tokenId={'erg'}
              amount={-txValues.total}
              networkType={props.wallet.networkType}
            />
          ) : null}
          {Object.entries(txValues.tokens).map(([tokenId, value]) =>
            value < 0 ? (
              <TokenAmount
                tokenId={tokenId}
                amount={-value}
                networkType={props.wallet.networkType}
                key={tokenId}
              />
            ) : null,
          )}
        </React.Fragment>
      ) : null}
      {props.date ? (
        <React.Fragment>
          <Typography variant="body2" color="textSecondary" mt={2}>
            Received on
          </Typography>
          <Typography mb={2}>{props.date}</Typography>
          <Typography variant="body2" color="textSecondary">
            Transaction Id
          </Typography>
          <Typography mb={2} sx={{ overflowWrap: 'anywhere' }} onClick={openTx}>
            {props.tx.id().to_str()}
            <IconButton>
              <OpenInNew />
            </IconButton>
          </Typography>
        </React.Fragment>
      ) : (
        <FormHelperText sx={{ mb: 2 }}>
          These amount will be spent when transaction proceed.
        </FormHelperText>
      )}
      <UnBalancedTokensAmount
        amounts={issuedAndBurnt.burnt}
        color="error"
        label="Burning"
        networkType={props.wallet.networkType}
      />
      <UnBalancedTokensAmount
        amounts={issuedAndBurnt.issued}
        color="success"
        label="Issuing"
        networkType={props.wallet.networkType}
      />
    </Box>
  );
};

export default TxSignValues;
