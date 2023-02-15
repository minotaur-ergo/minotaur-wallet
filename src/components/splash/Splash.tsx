import React from 'react';
import { Box, styled, Typography, useTheme } from '@mui/material';
import MinotaurLogo from './MinotaurLogo';

const SplashBox = styled(Box)(
  ({ theme }) => `
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  & h1 {
    font-size: 1.5rem;
    position: absolute;
    bottom: 4.5rem;
  }
  
  & .background {
    background-color: ${theme.palette.primary.dark};
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    & svg {
      width: 100%;
      height: 100%;
    }
  }
`
);

const Splash = () => {
  const theme = useTheme();

  return (
    <SplashBox>
      <Box className="background">
        <svg viewBox="0 0 100 200">
          <circle
            cx={-30}
            cy={0}
            r={110}
            fill={theme.palette.primary.light}
            opacity={0.1}
          />
          <circle
            cx={120}
            cy={0}
            r={80}
            fill={theme.palette.primary.light}
            opacity={0.1}
          />
          <circle
            cx={70}
            cy={170}
            r={40}
            fill={theme.palette.primary.main}
            opacity={0.6}
            filter="blur(30px)"
          />
        </svg>
      </Box>
      <MinotaurLogo
        style={{ width: '80%', filter: 'drop-shadow(0px 4px 6px #00000088)' }}
      />
      <Typography variant="h1" color="primary.light">
        Minotaur
      </Typography>
    </SplashBox>
  );
};

export default Splash;
