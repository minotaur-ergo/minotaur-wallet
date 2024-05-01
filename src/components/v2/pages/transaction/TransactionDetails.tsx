import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { IconButton, Stack, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import { TokenItem } from '../send/steps/EnterPassword';

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

      <div>
        <Typography variant="body2" color="textSecondary">
          Transaction Id
        </Typography>
        <Typography mb={2} sx={{ overflowWrap: 'anywhere' }}>
          {transaction.id}
        </Typography>
      </div>

      <Typography variant="body2" color="textSecondary">
        Burning tokens
      </Typography>
      <Stack sx={{ mb: 2, mt: 1 }} gap={0.5}>
        <TokenItem name="Token 1" amount={10} color="error" />
        <TokenItem name="Token 2" amount={5} color="error" />
      </Stack>
      <Typography variant="body2" color="textSecondary">
        Issuing tokens
      </Typography>
      <Stack sx={{ mb: 2, mt: 1 }} gap={0.5}>
        <TokenItem name="Token 1" amount={3} color="success" />
        <TokenItem name="Token 2" amount={24} color="success" />
      </Stack>
    </AppFrame>
  );
};

export default TransactionDetails;
