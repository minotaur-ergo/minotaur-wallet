import { Avatar, Box, Card, CardActionArea, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../../V2Demo';

interface PropsType {
  name: string;
  id: string;
  src?: string;
}

export default function ({ name = '', id = '', src }: PropsType) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(RouterMap.ConnectedDApp.replace(':dappid', id));
  };

  return (
    <Card>
      <CardActionArea onClick={handleClick} sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar alt={name} src={src || '/'} />
          <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
