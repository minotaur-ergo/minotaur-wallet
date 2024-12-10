import { Avatar, Box, Typography } from '@mui/material';
import DisplayId from './DisplayId';
import { TokenType } from '../models';

interface PropsType extends TokenType {
  displayLogo?: boolean;
}

export default function DisplayToken({
  name,
  amount,
  id,
  logoSrc,
  displayLogo = true,
}: PropsType) {
  return (
    <div>
      {displayLogo && (
        <Box sx={{ float: 'left', mr: 2 }}>
          <Avatar alt={name} src={logoSrc || '/'} />
        </Box>
      )}
      <Box display="flex">
        <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
        <Typography>{amount}</Typography>
      </Box>
      <DisplayId variant="body2" color="textSecondary" id={id} />
    </div>
  );
}
