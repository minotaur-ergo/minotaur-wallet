import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import DisplayId from '../../components/DisplayId';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';

export default function ({ type, amount, date, id }: any) {
  const navigate = useNavigate();
  const theme = useTheme();
  const values =
    type === 'in'
      ? {
          title: 'Receive',
          sign: '+',
          color: theme.palette.success.main,
        }
      : {
          title: 'Send',
          sign: '-',
          color: theme.palette.error.main,
        };
  const formatDate = (date: number | string): string => {
    const d = new Date(date);
    return d.toLocaleString();
  };
  const handleClick = () => navigate(RouterMap.TransactionDetails);
  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Box display="flex">
            <Typography sx={{ flexGrow: 1 }}>{values.title}</Typography>
            <Typography color={values.color}>
              {values.sign}
              {amount.toFixed(2)} <small>ERG</small>
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {formatDate(date)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Includes 3 tokens
          </Typography>
          <DisplayId variant="body2" color="textSecondary" id={id} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
