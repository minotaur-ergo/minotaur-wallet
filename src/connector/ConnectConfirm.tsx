import { Card, CardActionArea, Stack, Typography } from '@mui/material';
import React from 'react';

const ConnectConfirm = () => {
  return (
    <React.Fragment>
      <Typography mb={3}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat.
      </Typography>
      <Stack spacing={3} sx={{ width: '50%', mx: 'auto' }}>
        {options.map((word, index) => (
          <Card key={index}>
            <CardActionArea sx={{ p: 2 }} onClick={handleConfirmCode(word)}>
              <Typography
                textAlign="center"
                letterSpacing="0.4rem"
                fontSize="1.5rem"
              >
                {word}
              </Typography>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </React.Fragment>
  );
};

export default ConnectConfirm;
