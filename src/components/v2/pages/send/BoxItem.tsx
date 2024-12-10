import { Box, Stack } from '@mui/material';
import DisplayId from '../../components/DisplayId';
import { TokenType } from '../../models';
import DisplayToken from '../../components/DisplayToken';

interface PropsType {
  id: string;
  tokens: TokenType[];
}

export default function ({ tokens, id = '' }: PropsType) {
  return (
    <Box display="flex" sx={{ gap: 1 }}>
      <Box
        sx={{
          width: 8,
          m: 0.5,
          borderRadius: 4,
          opacity: 0.5,
          bgcolor: 'primary.light',
        }}
      />
      <Stack spacing={1} sx={{ overflow: 'auto' }}>
        <DisplayId variant="body2" color="textSecondary" id={id} />
        {tokens.map((token) => (
          <DisplayToken key={token.id} {...token} />
        ))}
      </Stack>
    </Box>
  );
}
