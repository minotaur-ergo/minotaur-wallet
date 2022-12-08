import React from 'react';
import { Box, Divider, Stack } from '@mui/material';
import Heading from '../../components/Heading';
import TransactionItem from '../transaction/TransactionItem';
import { RouterMap } from '../../V2Demo';
import StateMessage from '../../components/StateMessage';
import SvgIcon from '../../icons/SvgIcon';

const RecentTransactions = () => {
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
  ];
  return (
    <Box sx={{ mb: 2 }}>
      <Heading
        title="Recent Transactions"
        actionLabel="View all"
        actionPath={RouterMap.Transactions}
        disabled={transactions.length === 0}
      />
      {transactions.length > 0 ? (
        <Stack divider={<Divider />} spacing={1}>
          {transactions.map((item, index) => (
            <TransactionItem {...item} key={index} />
          ))}
        </Stack>
      ) : (
        <Box p={3}>
          <StateMessage
            title="No record"
            description="You have not any transactions yet!"
            icon={<SvgIcon icon="document" />}
          />
        </Box>
      )}
    </Box>
  );
};

export default RecentTransactions;
