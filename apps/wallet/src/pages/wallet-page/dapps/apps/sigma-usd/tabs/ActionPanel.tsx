import { Button, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { formatWithDecimals } from '../utils';

interface PurchasePanelPropsType {
  max: bigint;
  decimals: number;
  name: string;
  label: 'Purchase' | 'Redeem';
  action: (amount: bigint) => unknown;
}
const ActionPanel = (props: PurchasePanelPropsType) => {
  const [amount, setAmount] = useState('');
  const [valid, setValid] = useState(false);

  const getValue = useCallback(() => {
    const parts = amount.split('.');
    const integerPart = BigInt(parts[0] || '0');
    const decimalPart = (parts[1] || '').padEnd(props.decimals, '0');
    const factor = BigInt('1' + '0'.repeat(props.decimals));
    return integerPart * factor + BigInt(decimalPart || '0');
  }, [amount, props.decimals]);

  useEffect(() => {
    const regex = RegExp(`^[0-9]+(\\.[0-9]{0,${props.decimals}})?$`);
    const matchesFormat = regex.test(amount);

    if (!matchesFormat) {
      setValid(false);
      return;
    }

    try {
      const value = getValue();
      setValid(value <= props.max);
    } catch {
      setValid(false);
    }
  }, [amount, props.decimals, props.max, getValue]);

  return (
    <React.Fragment>
      <Typography variant="h2">
        {props.label} {props.name}
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 2, mt: 1 }}>
        Maximum Available:
        <Typography component="span" color="textPrimary">
          {formatWithDecimals(props.max, props.decimals)}
        </Typography>
      </Typography>
      <TextField
        autoComplete="off"
        label="Amount"
        sx={{ mb: 2 }}
        value={amount}
        onChange={({ target }) => setAmount(target.value)}
        error={!valid && amount !== ''}
        helperText={
          !valid && amount !== '' ? 'Invalid amount or exceeds maximum' : ' '
        }
        inputProps={{ inputMode: 'decimal' }}
      />
      <Button
        disabled={!valid || getValue() == 0n}
        onClick={() => props.action(getValue())}
      >
        {props.label}
      </Button>
    </React.Fragment>
  );
};

export default ActionPanel;
