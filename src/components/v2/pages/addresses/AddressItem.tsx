import React, { useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DisplayId from '../../components/DisplayId';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';

interface PropsType {
  name?: string;
  amount?: number;
  id?: string;
}

export default function ({ name = '', amount = 0, id = '' }: PropsType) {
  const [open, set_open] = useState(false);
  const [editing, set_editing] = useState(false);
  const [newValue, set_newValue] = useState(name);
  const handle_open = () => set_open(true);
  const handle_close = () => set_open(false);
  const handle_edit = () => set_editing(true);
  const handle_cancel = () => {
    set_editing(false);
    set_newValue(name);
  };
  const handle_confirm = () => {
    // onChange()
    set_editing(false);
  };
  return (
    <Card>
      <CardActionArea onClick={handle_open} sx={{ p: 2 }}>
        <Box display="flex">
          <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
          <Typography>
            {amount.toFixed(2)} <small>ERG</small>
          </Typography>
        </Box>
        <DisplayId variant="body2" color="textSecondary" id={id} />
      </CardActionArea>

      <Drawer anchor="bottom" open={open && !editing} onClose={handle_close}>
        <Box display="flex" mb={2}>
          <IconButton onClick={handle_edit}>
            <EditOutlinedIcon />
          </IconButton>
          <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
            {name}
          </Typography>
          <IconButton onClick={handle_close}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 8, textAlign: 'center', fontStyle: 'italic' }}>
          _QR CODE_
        </Box>
        <Card sx={{ display: 'flex', bgcolor: 'info.light', p: 2 }}>
          <Typography sx={{ overflowWrap: 'anywhere' }}>{id}</Typography>
          <IconButton>
            <ContentCopyIcon />
          </IconButton>
        </Card>
        <Typography
          sx={{ my: 2, overflowWrap: 'anywhere', textAlign: 'center' }}
          variant="body2"
          color="textSecondary"
        >
          Derivation path: {"m/44'/429'/0'/00/"}
        </Typography>
      </Drawer>

      <Drawer anchor="bottom" open={editing}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          Edit Address Name
        </Typography>
        <TextField
          variant="standard"
          value={newValue}
          onChange={(e) => set_newValue(e.target.value)}
          inputProps={{ autoFocus: true }}
        />
        <Stack direction="row-reverse" spacing={2}>
          <Button
            onClick={handle_confirm}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Save
          </Button>
          <Button
            onClick={handle_cancel}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Cancel
          </Button>
        </Stack>
      </Drawer>
    </Card>
  );
}
