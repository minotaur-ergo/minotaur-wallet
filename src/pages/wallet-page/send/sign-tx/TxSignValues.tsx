import { Box, FormHelperText, Typography } from '@mui/material';
import { ErgoBox } from 'ergo-lib-wasm-browser';
import * as wasm from 'ergo-lib-wasm-browser';
import React, { useEffect, useState } from 'react';
import { extractErgAndTokenSpent } from '@/action/tx';
import TokenAmount from '@/components/token-amount/TokenAmount';
import { StateWallet } from '@/store/reducer/wallet';
import useIssuedAndBurntTokens from '@/hooks/useIssuedAndBurntTokens';
import UnBalancedTokensAmount from '@/components/token-amount/UnBalancedTokensAmount';

interface WalletSignNormalPropsType {
  tx: wasm.UnsignedTransaction | wasm.Transaction;
  boxes: Array<ErgoBox>;
  wallet: StateWallet;
}

interface Values {
  total: bigint;
  txId: string;
  tokens: { [tokenId: string]: bigint };
}

const TxSignValues = (props: WalletSignNormalPropsType) => {
  const [txValues, setTxValues] = useState<Values>({
    total: 0n,
    txId: '',
    tokens: {},
  });
  const issuedAndBurnt = useIssuedAndBurntTokens(props.tx, props.boxes);
  const [valuesDirection, setValuesDirection] = useState({
    incoming: false,
    outgoing: false,
  });
  useEffect(() => {
    const unsigned = props.tx;
    if (txValues.txId !== unsigned.id().to_str()) {
      const values = extractErgAndTokenSpent(
        props.wallet,
        props.boxes,
        unsigned,
      );
      const incoming =
        values.value < 0n ||
        Object.values(values.tokens).filter((amount) => amount < 0n).length > 0;
      const outgoing =
        values.value > 0n ||
        Object.values(values.tokens).filter((amount) => amount > 0n).length > 0;
      setValuesDirection({ incoming, outgoing });
      setTxValues({
        total: values.value,
        tokens: values.tokens,
        txId: unsigned.id().to_str(),
      });
    }
  }, [txValues.txId, props.tx, props.wallet, props.boxes]);
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
      <FormHelperText sx={{ mb: 2 }}>
        These amount will be spent when transaction proceed.
      </FormHelperText>
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
