import { Avatar, Box, Typography } from '@mui/material';
import DisplayId from './DisplayId';
import { TokenType } from '../models';

interface PropsType extends Partial<TokenType> {
  displayLogo?: boolean;
  displayAmount?: boolean;
  style?: React.CSSProperties;
}

export default function DisplayToken({
  name,
  amount,
  id,
  logoSrc,
  displayLogo = true,
  displayAmount = true,
  style,
}: PropsType) {
  return (
    <div style={style}>
      {displayLogo && (
        <Box sx={{ float: 'left', mr: 2 }}>
          <Avatar alt={name} src={logoSrc || '/'} />
        </Box>
      )}
      <Box display="flex">
        <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
        {displayAmount && <Typography>{amount}</Typography>}
      </Box>
      <DisplayId variant="body2" color="textSecondary" id={id} />
    </div>
  );
}
