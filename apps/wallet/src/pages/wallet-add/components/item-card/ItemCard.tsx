import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ItemCardPropsType {
  title: string;
  description?: string;
  path: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  icon: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

const ItemCard = (props: ItemCardPropsType) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(props.path);
  return (
    <Card sx={{ position: 'relative' }}>
      <CardActionArea onClick={handleClick}>
        <CardHeader
          avatar={props.icon}
          title={props.title}
          sx={{
            pb: 0,
            color: 'primary.dark',
            '& .MuiCardHeader-title': { fontSize: '1.1rem' },
          }}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: -1,
          opacity: 0.1,
          transform: 'scale(7) translate(-10%, 15px)',
        }}
      >
        {props.icon}
      </Box>
    </Card>
  );
};

export default ItemCard;
