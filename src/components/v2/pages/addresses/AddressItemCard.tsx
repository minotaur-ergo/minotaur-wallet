import { Box, Card, CardActionArea, Typography } from '@mui/material';
import DisplayId from '../../components/DisplayId';
import StarsIcon from '@mui/icons-material/Stars';

interface PropsType {
  name: string;
  amount: number;
  id: string;
  numberOfTokens: number;
  isDefault?: boolean;
  handleOpen: () => void;
}

const AddressItemCard = ({
  amount,
  id,
  isDefault,
  name,
  numberOfTokens,
  handleOpen,
}: PropsType) => {
  return (
    <Card>
      <CardActionArea onClick={handleOpen} sx={{ p: 2 }}>
        <Box display="flex">
          <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
          <Typography>
            {amount?.toFixed(2)} <small>ERG</small>
          </Typography>
        </Box>
        {isDefault && (
          <Typography variant="body2" color="info.main" mb={1}>
            <StarsIcon
              fontSize="inherit"
              sx={{ mr: 1, verticalAlign: 'middle' }}
            />
            Default address
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary" mt={1}>
          {numberOfTokens > 0
            ? `Includes ${numberOfTokens} token${numberOfTokens > 1 ? 's' : ''}`
            : 'No token'}
        </Typography>
        <DisplayId variant="body2" color="textSecondary" id={id} />
      </CardActionArea>
    </Card>
  );
};

export default AddressItemCard;
