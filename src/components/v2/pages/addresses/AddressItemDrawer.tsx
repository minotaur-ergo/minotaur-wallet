import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Heading from '../../components/Heading';
import ListController from '../../components/ListController';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AddressCopy from '../../components/AddressCopy';
import { useState } from 'react';
import DisplayToken from '../../components/DisplayToken';
import { TokenType } from '../../models';

interface PropsType {
  name: string;
  id: string;
  open: boolean;
  tokens: TokenType[];
  isDefault?: boolean;
  handleClose: () => void;
}

const AddressItemDrawer = ({
  open,
  name,
  id,
  tokens,
  isDefault,
  handleClose,
}: PropsType) => {
  const [editing, setEditing] = useState(false);
  const [newValue, setNewValue] = useState(name);

  const getTokens = () =>
    new Promise((resolve) => {
      resolve(tokens);
    });
  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setNewValue(name);
  };
  const handleConfirm = () => {
    // onChange()
    setEditing(false);
  };

  return (
    <>
      <Drawer anchor="bottom" open={open && !editing} onClose={handleClose}>
        <Box display="flex" mb={2}>
          <IconButton onClick={handleEdit}>
            <EditOutlinedIcon />
          </IconButton>
          <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
            {name}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Heading title="Tokens" />
        <ListController
          ListItem={<DisplayToken amount={0} name="" id="" />}
          getData={getTokens}
          divider={false}
          emptyTitle="There is no tokens!"
          emptyIcon={false}
        />
        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 8, textAlign: 'center', fontStyle: 'italic' }}>
          _QR CODE_
        </Box>
        <AddressCopy address={id} />
        <Typography
          sx={{ my: 2, overflowWrap: 'anywhere', textAlign: 'center' }}
          variant="body2"
          color="textSecondary"
        >
          Derivation path: {"m/44'/429'/0'/00/"}
        </Typography>
        {!isDefault && <Button variant="text">Set as default</Button>}
      </Drawer>

      <Drawer anchor="bottom" open={editing}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          Edit Address Name
        </Typography>
        <TextField
          variant="standard"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          inputProps={{ autoFocus: true }}
        />
        <Stack direction="row-reverse" spacing={2}>
          <Button
            onClick={handleConfirm}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Save
          </Button>
          <Button
            onClick={handleCancel}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Cancel
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default AddressItemDrawer;
