import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { TransactionTokenType } from '../../models';

export default function TransactionTokenItem({
  name,
  amount,
  type,
}: TransactionTokenType) {
  const color = ['Received', 'Issued'].includes(type)
    ? 'success.main'
    : 'error.main';
  return (
    <ListItem
      disableGutters
      disablePadding
      secondaryAction={<Typography color={color}>{amount}</Typography>}
    >
      <ListItemAvatar>
        <Avatar>{name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={type}
        secondaryTypographyProps={{ color }}
      />
    </ListItem>
  );
}
