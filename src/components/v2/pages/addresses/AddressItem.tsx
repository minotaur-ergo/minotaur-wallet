import React, { useRef, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  Divider,
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
import SnackAlert, { SnackAlertHandle } from '../../components/SnackAlert';
import ListController from '../../components/ListController';
import Heading from '../../components/Heading';

interface PropsType {
  name?: string;
  amount?: number;
  id?: string;
  numberOfTokens?: number;
}

interface TokenType {
  name?: string;
  amount?: number;
}

const TokenItem = ({ name, amount }: TokenType) => {
  return (
    <Box display="flex">
      <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
      <Typography>{amount}</Typography>
    </Box>
  );
};

export default function ({
  name = '',
  amount = 0,
  id = '',
  numberOfTokens = 0,
}: PropsType) {
  const [open, set_open] = useState(false);
  const [editing, set_editing] = useState(false);
  const [newValue, set_newValue] = useState(name);
  const snackbar = useRef<SnackAlertHandle>(null);
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
  const handle_copy = () => {
    snackbar.current?.open();
  };
  const get_tokens = () =>
    new Promise((resolve) => {
      const tokens = [];
      const N = Math.floor(Math.random() * 10);
      for (let i = 0; i < N; i++) {
        tokens.push({
          name: `Token ${i + 1}`,
          amount: Math.floor(Math.random() * 5000) / 10,
        });
      }
      resolve(tokens);
    });

  return (
    <Card>
      <CardActionArea onClick={handle_open} sx={{ p: 2 }}>
        <Box display="flex" mb={1}>
          <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
          <Typography>
            {amount.toFixed(2)} <small>ERG</small>
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {numberOfTokens > 0
            ? `Includes ${numberOfTokens} token${numberOfTokens > 1 ? 's' : ''}`
            : 'No token'}
        </Typography>
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
        <Heading title="Tokens" />
        <ListController
          ListItem={<TokenItem />}
          getData={get_tokens}
          divider={false}
          emptyTitle="There is no tokens!"
          emptyIcon={false}
        />
        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 8, textAlign: 'center', fontStyle: 'italic' }}>
          _QR CODE_
        </Box>
        <Card>
          <CardActionArea
            onClick={handle_copy}
            sx={{ display: 'flex', bgcolor: 'info.light', p: 2 }}
          >
            <Typography sx={{ overflowWrap: 'anywhere' }}>{id}</Typography>
            <IconButton>
              <ContentCopyIcon />
            </IconButton>
          </CardActionArea>
        </Card>
        <SnackAlert ref={snackbar} message="Address copied!" />
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
