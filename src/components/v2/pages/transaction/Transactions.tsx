import React from 'react';
import { Button, Divider, Stack } from '@mui/material';
import TransactionItem from './TransactionItem';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';

const Transactions = () => {
  const transactions = [
    {
      type: 'in',
      amount: 60,
      date: 1670387141000,
      id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2c25f',
    },
    {
      type: 'in',
      amount: 43.2,
      date: 1670377141000,
      id: '0841add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2086b',
    },
    {
      type: 'out',
      amount: 60,
      date: 1670376141000,
      id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
    },
    {
      type: 'in',
      amount: 20.15,
      date: 1670342141000,
      id: '236830841bd1d6add086b2eae7ef2c25f',
    },
    {
      type: 'in',
      amount: 60,
      date: 1670387141000,
      id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2c25f',
    },
    {
      type: 'in',
      amount: 43.2,
      date: 1670377141000,
      id: '0841add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2086b',
    },
    {
      type: 'out',
      amount: 60,
      date: 1670376141000,
      id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
    },
    {
      type: 'in',
      amount: 20.15,
      date: 1670342141000,
      id: '236830841bd1d6add086b2eae7ef2c25f',
    },
    {
      type: 'out',
      amount: 60,
      date: 1670376141000,
      id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
    },
    {
      type: 'out',
      amount: 60,
      date: 1670376141000,
      id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
    },
  ];
  return (
    <AppFrame title="Transactions" navigation={<BackButton />}>
      <Stack divider={<Divider />} spacing={1}>
        {transactions.map((item, index) => (
          <TransactionItem {...item} key={index} />
        ))}
      </Stack>
      <Button variant="outlined" sx={{ my: 2 }}>
        Show more
      </Button>
    </AppFrame>
  );
};

export default Transactions;
