import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { IconButton, List, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import TransactionTokenItem from './TransactionTokenItem';

const TransactionDetails = () => {
  const transaction = {
    type: 'in',
    amount: 60,
    date: 1670387141000,
    id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2c25f',
  };

  const title = `${transaction.type === 'in' ? 'Receive' : 'Send'} Transaction`;
  const color = transaction.type === 'in' ? 'success.main' : 'error.main';
  const date = new Date(transaction.date).toLocaleString();

  return (
    <AppFrame
      title={title}
      navigation={<BackButton />}
      actions={
        <IconButton>
          <InventoryIcon />
        </IconButton>
      }
    >
      <Typography fontSize="2rem" textAlign="center" color={color} mb={2}>
        {transaction.amount}
        <Typography component="span" ml={1}>
          ERG
        </Typography>
      </Typography>

      <Typography variant="body2" color="textSecondary">
        Received on
      </Typography>
      <Typography mb={2}>{date}</Typography>

      <Typography variant="body2" color="textSecondary">
        Transaction Id
      </Typography>
      <Typography mb={2} sx={{ overflowWrap: 'anywhere' }}>
        {transaction.id}
      </Typography>

      <Typography variant="body2" color="textSecondary">
        Tokens
      </Typography>
      <List disablePadding>
        <TransactionTokenItem name="First Token" amount={40} type="Received" />
        <TransactionTokenItem
          name="Second Token"
          amount={60.02}
          type="Issued"
        />
        <TransactionTokenItem name="Last Token" amount={-0.1} type="Burned" />
      </List>
    </AppFrame>
  );
};

export default TransactionDetails;
