import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { CheckCircleOutline } from '@mui/icons-material';

export default function BoxConsolidation() {
  const boxesCount = 3;
  const oldestAge = 0.2;

  return (
    <AppFrame
      title="Box Consolidation"
      navigation={<BackButton />}
      toolbar={<Button>Renew {boxesCount} boxe</Button>}
    >
      <FormControl sx={{ mb: 2 }}>
        <InputLabel>Address</InputLabel>
        <Select value={1}>
          <MenuItem value={1}>Main Address</MenuItem>
          <MenuItem value={2}>Secondary Address</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="body2" color="textSecondary">
        Number of unspent boxes
      </Typography>
      <Typography mb={1}>
        <Typography component="span" fontSize="large">
          {boxesCount}
        </Typography>{' '}
        boxes
      </Typography>
      <Typography
        color="success.main"
        fontWeight={500}
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <CheckCircleOutline />
        It's fine.
      </Typography>
      <Typography variant="body2" color="textSecondary" pl={4} mb={3}>
        The number of boxes more than 100 slows down the wallet.
      </Typography>

      <Typography variant="body2" color="textSecondary">
        Age of oldest box
      </Typography>
      <Typography mb={1}>
        <Typography component="span" fontSize="large">
          {oldestAge}
        </Typography>{' '}
        years
      </Typography>
      <Typography
        color="success.main"
        fontWeight={500}
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <CheckCircleOutline />
        It's fine.
      </Typography>
      <Typography variant="body2" color="textSecondary" pl={4} mb={3}>
        Storage rent will be applied on boxes older than 4 years.
      </Typography>

      <Divider />

      <Typography
        textAlign="center"
        fontSize="x-large"
        color="success.main"
        mt={3}
        mb={2}
      >
        You are fine!
      </Typography>
      <Typography textAlign="center" variant="body2" color="textSecondary">
        You can renew 3 boxes, but it is not necessary.
      </Typography>
    </AppFrame>
  );
}
