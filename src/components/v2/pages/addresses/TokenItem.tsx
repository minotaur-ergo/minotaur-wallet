import { Box, Typography } from '@mui/material';

export interface TokenType {
  name: string;
  amount: number;
}

const TokenItem = ({ name, amount }: TokenType) => {
  return (
    <Box display="flex">
      <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
      <Typography>{amount}</Typography>
    </Box>
  );
};

export default TokenItem;
