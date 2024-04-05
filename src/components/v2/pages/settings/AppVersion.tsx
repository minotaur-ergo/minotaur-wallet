import { Box, Typography } from '@mui/material';
import MinotaurLogo from '../../../splash/MinotaurLogo';

const AppVersion = () => {
  return (
    <Box mt={4} display="flex" flexDirection="column" alignItems="center">
      <MinotaurLogo style={{ width: 64, marginBottom: -8 }} />
      <Typography variant="body2" textAlign="center">
        Minotaur v0.8.1
      </Typography>
    </Box>
  );
};

export default AppVersion;
