import { Button, TextField, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect, useState } from 'react';
import { AssetDbAction } from '@/action/db';
import { numberWithDecimalToBigInt, tokenStr } from '@/utils/functions';
import TokenAmountDisplay from '../amounts-display/TokenAmountDisplay';

interface ErgAmountPropsType {
  network_type: string;
  amount: bigint | null;
  setAmount: (newAmount: bigint) => unknown;
  total: bigint;
  tokenId: 'erg' | string;
  availableLabel?: string;
  setHasError?: (isValid: boolean) => void;
}

const TokenAmountInput = (props: ErgAmountPropsType) => {
  const [amount, setAmount] = useState<{
    decimal: number;
    value: string;
    bigInt: bigint | null;
  }>({
    value: '',
    bigInt: 0n,
    decimal: 0,
  });

  const [decimal, setDecimal] = useState({
    amount: 0,
    token: '',
    name: '',
  });
  const availableLabel = props.availableLabel ?? 'available';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && props.tokenId !== decimal.token) {
      if (props.tokenId === 'erg') {
        setDecimal({
          amount: 9,
          token: 'erg',
          name: 'Erg',
        });
      } else {
        setLoading(true);
        const tokenId = props.tokenId;
        AssetDbAction.getInstance()
          .getAssetByAssetId(tokenId, props.network_type)
          .then((res) => {
            setDecimal({
              amount: res && res.decimal ? res.decimal : 0,
              token: tokenId,
              name: res && res.name ? res.name : tokenId.substring(6) + '...',
            });
            setLoading(false);
          });
      }
    }
  }, [loading, props.tokenId, props.network_type, decimal.token]);

  useEffect(() => {
    if (props.amount !== amount.bigInt || decimal.amount !== amount.decimal) {
      const usedDecimal = decimal.amount;
      const outLayerValue =
        props.amount && props.amount !== 0n
          ? tokenStr(props.amount, usedDecimal)
          : '';
      setAmount({
        value: outLayerValue,
        bigInt: props.amount,
        decimal: usedDecimal,
      });
    }
  }, [props.amount, amount.bigInt, amount.decimal, decimal.amount]);

  const editAmount = (amount: string) => {
    try {
      const amountBigInt = numberWithDecimalToBigInt(amount, decimal.amount);
      setAmount({
        value: amount,
        bigInt: amountBigInt,
        decimal: decimal.amount,
      });
      props.setAmount(amountBigInt);

      if (amountBigInt > props.total) {
        setError('Amount exceeds available balance');
        props.setHasError?.(false);
      } else {
        setError(null);
        props.setHasError?.(true);
      }
    } catch (e) {
      console.log(e);
      props.setHasError?.(false);
    }
  };

  return (
    <TextField
      label="Amount"
      value={amount.value}
      onChange={(event) => editAmount(event.target.value)}
      error={!!error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Typography>{decimal.name}</Typography>
          </InputAdornment>
        ),
      }}
      helperText={
        error || (
          <Button
            variant="text"
            fullWidth={false}
            sx={{ p: 0, minWidth: 'unset', color: 'info.dark' }}
            onClick={() => editAmount(tokenStr(props.total, decimal.amount))}
          >
            <Typography>
              <TokenAmountDisplay
                amount={props.total > 0n ? props.total : 0n}
                decimal={decimal.amount}
              />
              {' ' + decimal.name} {availableLabel}
            </Typography>
          </Button>
        )
      }
    />
  );
};

export default TokenAmountInput;
