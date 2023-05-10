import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import DisplayId from '../../components/DisplayId';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import DisplayProperty from '../../components/DisplayProperty';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface PropsType {
  name?: string;
  amount?: number;
  id?: string;
  logoSrc?: string;
}

export default function ({
  name = '',
  amount = 0,
  id = '',
  logoSrc,
}: PropsType) {
  const [displayDetailsDrawer, set_displayDetailsDrawer] = useState(false);
  const handle_open_details = () => set_displayDetailsDrawer(true);
  const handle_close_details = () => set_displayDetailsDrawer(false);

  return (
    <Card>
      <CardActionArea onClick={handle_open_details} sx={{ p: 2 }}>
        <Box sx={{ float: 'left', mr: 2 }}>
          <Avatar alt={name} src={logoSrc || '/'} />
        </Box>
        <Box display="flex">
          <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
          <Typography>
            {amount.toFixed(2)} <small>ERG</small>
          </Typography>
        </Box>
        <DisplayId variant="body2" color="textSecondary" id={id} />
      </CardActionArea>

      <Drawer
        anchor="bottom"
        open={displayDetailsDrawer}
        onClose={handle_close_details}
      >
        <Box display="flex" alignItems="start">
          <Box>
            {logoSrc && (
              <Avatar
                alt={name}
                src={logoSrc}
                sx={{ mt: 2, width: 64, height: 64 }}
              />
            )}
            <Typography variant="h2" sx={{ mt: 2 }}>
              {name}
            </Typography>
          </Box>
          <IconButton onClick={handle_close_details} sx={{ ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography sx={{ mt: 1 }}>
          {'Some description about this asset goes here.'}
        </Typography>

        <Stack spacing={2} sx={{ mt: 3 }}>
          <DisplayProperty label="Emission amount" value={1000000} />
          <DisplayProperty label="Balance" value={120} />
          <DisplayProperty
            label="Token Id"
            value={id}
            endAdornment={
              <IconButton>
                <ContentCopyIcon />
              </IconButton>
            }
          />
          <DisplayProperty label="Minting transaction" value={null} />
        </Stack>
      </Drawer>
    </Card>
  );
}
