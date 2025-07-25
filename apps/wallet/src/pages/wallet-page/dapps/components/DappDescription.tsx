import React, { useState } from 'react';

import { DAppType } from '@minotaur-ergo/types';
import { Close, InfoOutlined } from '@mui/icons-material';
import { Box, Drawer, IconButton, Typography } from '@mui/material';

interface DAppDescriptionPropsType {
  dapp?: DAppType;
}

const DAppDescription = (props: DAppDescriptionPropsType) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  if (props.dapp && props.dapp.readme) {
    return (
      <React.Fragment>
        <IconButton color="inherit" onClick={() => setShow(true)}>
          <InfoOutlined />
        </IconButton>
        <Drawer anchor="bottom" open={show} onClose={handleClose}>
          <Box display="flex" mb={2}>
            <Box sx={{ flexBasis: 40 }} />
            <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
              {props.dapp.name}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          {props.dapp.readme}
        </Drawer>
      </React.Fragment>
    );
  }
  return null;
};

export default DAppDescription;
