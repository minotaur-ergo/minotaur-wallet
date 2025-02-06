import { Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { formatWithDecimals } from '../utils';
import { createEmptyArray } from '@/utils/functions';

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
  const getValue = () => {
    const parts = amount.split('.');
    const factor = BigInt('1' + createEmptyArray(props.decimals, '0').join(''));
    return (
      BigInt('0' + parts[0]) * factor +
      (parts.length > 1 ? BigInt('0' + parts[1]) : 0n)
    );
  };
  useEffect(() => {
    const regex = RegExp(`^[0-9]+(.[0-9]{0-${props.decimals}})?`);
    setValid(regex.test(amount));
  }, [amount, props.decimals]);
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
