import { ChangeEvent, useState } from 'react';
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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import AddressCopy from '../../components/AddressCopy';

interface PropsType {
  name?: string;
  address?: string;
}

export default function ({ name = '', address = '' }: PropsType) {
  const [open, set_open] = useState(false);
  const [editing, set_editing] = useState(false);
  const [deleting, set_deleting] = useState(false);
  const [values, set_values] = useState({ name, address });
  const handle_open = () => set_open(true);
  const handle_close = () => set_open(false);
  const handle_edit = () => set_editing(true);
  const handle_delete = () => set_deleting(true);
  const handle_cancel = () => {
    set_deleting(false);
    set_editing(false);
    set_values({ name, address });
  };
  const handle_confirm_edit = () => {
    // onChange()
    set_editing(false);
  };
  const handle_confirm_delete = () => {
    set_open(false);
    set_deleting(false);
  };
  const handle_change_value =
    (fieldName: string) => (event: ChangeEvent<HTMLInputElement>) => {
      set_values((prevState) => ({
        ...prevState,
        [fieldName]: event.target.value,
      }));
    };
  return (
    <Card>
      <CardActionArea onClick={handle_open} sx={{ p: 2 }}>
        <Typography>{name}</Typography>
        <DisplayId variant="body2" color="textSecondary" id={address} />
      </CardActionArea>

      <Drawer
        anchor="bottom"
        open={open && !editing && !deleting}
        onClose={handle_close}
      >
        <Box display="flex" mb={2}>
          <IconButton onClick={handle_edit}>
            <EditOutlinedIcon />
          </IconButton>
          <IconButton onClick={handle_delete}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
          <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
            {name}
          </Typography>
          <Box sx={{ flexBasis: 40 }} />
          <IconButton onClick={handle_close}>
            <CloseIcon />
          </IconButton>
        </Box>
        <AddressCopy address={address} />
      </Drawer>

      <Drawer anchor="bottom" open={editing}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          Edit Address
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Name"
            variant="standard"
            value={values.name}
            onChange={handle_change_value('name')}
            inputProps={{ autoFocus: true }}
          />
          <TextField
            label="Address"
            variant="standard"
            value={values.address}
            onChange={handle_change_value('address')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <ContentPasteOutlinedIcon />
                  </IconButton>
                  <IconButton>
                    <QrCodeScannerIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack direction="row-reverse" spacing={2}>
          <Button
            onClick={handle_confirm_edit}
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

      <Drawer anchor="bottom" open={deleting}>
        <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          Remove Address
        </Typography>
        <Typography>Are you sure?</Typography>
        <Stack direction="row-reverse" spacing={2}>
          <Button
            onClick={handle_confirm_delete}
            variant="text"
            fullWidth={false}
            sx={{ px: 0, minWidth: 0 }}
          >
            Remove
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
