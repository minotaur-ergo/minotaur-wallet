import { useState } from 'react';

import {
  Close,
  DeleteOutlineOutlined,
  EditOutlined,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';

import CopyToClipboardIcon from '@/components/copy-to-clipboard/CopyToClipboardIcon';
import DisplayId from '@/components/display-id/DisplayId';

import AddressBookDeleteAddressDrawer from './AddressBookDeleteAddressDrawer';
import AddressBookEditAddressDrawer from './AddressBookEditAddressDrawer';

interface PropsType {
  id: number;
  name: string;
  address: string;
  invalidate: () => unknown;
}

const AddressBookItem = (props: PropsType) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleClose = (invalidate: boolean) => {
    setEditing(false);
    setDeleting(false);
    if (invalidate) {
      props.invalidate();
    }
  };
  return (
    <Card>
      <CardActionArea onClick={() => setOpen(true)} sx={{ p: 2 }}>
        <Typography>{props.name}</Typography>
        <DisplayId variant="body2" color="textSecondary" id={props.address} />
      </CardActionArea>

      <Drawer
        anchor="bottom"
        open={open && !editing && !deleting}
        onClose={() => setOpen(false)}
      >
        <Box display="flex" mb={2}>
          <IconButton onClick={() => setEditing(true)}>
            <EditOutlined />
          </IconButton>
          <IconButton onClick={() => setDeleting(true)}>
            <DeleteOutlineOutlined />
          </IconButton>
          <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
            {props.name}
          </Typography>
          <Box sx={{ flexBasis: 40 }} />
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Card sx={{ display: 'flex', bgcolor: 'info.light', p: 2 }}>
          <Typography sx={{ overflowWrap: 'anywhere' }}>
            {props.address}
          </Typography>
          <CopyToClipboardIcon text={props.address} />
        </Card>
      </Drawer>

      <AddressBookEditAddressDrawer
        address={props.address}
        editing={editing}
        name={props.name}
        close={handleClose}
        id={props.id}
      />
      <AddressBookDeleteAddressDrawer
        deleting={deleting}
        id={props.id}
        close={handleClose}
      />
    </Card>
  );
};

export default AddressBookItem;
