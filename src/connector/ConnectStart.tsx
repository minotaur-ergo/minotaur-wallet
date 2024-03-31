import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import DisplayQRCode from '@/components/display-qrcode/DisplayQRCode';

interface ConnectStartPropsType {
  code: string;
  url: string;
  favIcon: string;
}

const ConnectStart = (props: ConnectStartPropsType) => {
  return (
    <React.Fragment>
      <Avatar sx={{ mx: 'auto', width: 64, height: 64 }} src={props.favIcon} />
      <Typography textAlign="center" mt={2} mb={4} px={2}>
        {props.url}
      </Typography>
      <Typography variant="body2" textAlign="center">
        Open Your Minotaur and scan this code
      </Typography>
      <Box sx={{ p: 4, textAlign: 'center', fontStyle: 'italic' }}>
        <DisplayQRCode value={props.code} type="ECR" />
      </Box>

      {/*<Typography textAlign="center">OR</Typography>
      <Button variant="text">Connect local system</Button> */}
    </React.Fragment>
  );
};

export default ConnectStart;
