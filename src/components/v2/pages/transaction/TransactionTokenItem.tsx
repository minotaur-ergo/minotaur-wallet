import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { TransactionTokenType } from '../../models';
import DisplayId from '../../components/DisplayId';

export default function TransactionTokenItem({
  name,
  amount,
  type,
}: TransactionTokenType) {
  const color = ['Received', 'Issued'].includes(type)
    ? 'success.main'
    : 'error.main';
  return (
    <ListItem disableGutters disablePadding>
      <ListItemAvatar>
        <Avatar>{name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography component="span">{name}</Typography>
            <Typography component="span" color={color}>
              {amount}
            </Typography>
          </>
        }
        primaryTypographyProps={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        secondary={
          <DisplayId
            id="c25f71cb2368306506add086b2eae7ef2841bd1d6add086b2eae7eeae7ef"
            endAdornment={
              <Typography color={color} ml={3}>
                {type}
              </Typography>
            }
          />
        }
      />
    </ListItem>
  );
}
