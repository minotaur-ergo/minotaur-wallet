import { Box, Typography } from '@mui/material';

import { version } from '@/../package.json';
import MinotaurLogo from '@/components/splash/MinotaurLogo';

const AppVersion = () => {
  return (
    <Box mt={16} display="flex" flexDirection="column" alignItems="center">
      <MinotaurLogo style={{ width: 64, marginBottom: -8 }} />
      <Typography variant="body2" textAlign="center">
        Minotaur {version}
      </Typography>
    </Box>
  );
};

export default AppVersion;
