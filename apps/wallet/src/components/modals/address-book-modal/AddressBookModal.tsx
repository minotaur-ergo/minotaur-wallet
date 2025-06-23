import { useEffect, useState } from 'react';

import { CircleOutlined, RadioButtonChecked } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogTitle,
  ListItemIcon,
  MenuItem,
  Typography,
} from '@mui/material';

import { SavedAddressDbAction } from '@/action/db';
import DisplayId from '@/components/display-id/DisplayId';
import SavedAddress from '@/db/entities/SavedAddress';

interface AddressBookModalPropsType {
  open: boolean;
  onClose: () => void;
  onChange?: (contact: SavedAddress) => void;
  address?: string;
}

const AddressBookModal = (props: AddressBookModalPropsType) => {
  const [addresses, setAddresses] = useState<Array<SavedAddress>>([]);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  useEffect(() => {
    if (!valid && props.open && !loading) {
      setLoading(true);
      SavedAddressDbAction.getInstance()
        .getAllAddresses()
        .then((addresses) => {
          setAddresses(addresses);
          setLoading(false);
          setValid(true);
        });
    } else if (!props.open) {
      setValid(false);
    }
  }, [valid, loading, props.open]);

  const handleSelect = (item: SavedAddress) => () => {
    if (props.onChange) props.onChange(item);
    props.onClose();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      PaperProps={{ sx: { pb: 2 } }}
    >
      <DialogTitle>Select From Address Book</DialogTitle>
      {addresses.map((item, index) => (
        <MenuItem key={index} onClick={handleSelect(item)}>
          <ListItemIcon>
            {item.address === props.address ? (
              <RadioButtonChecked color="primary" />
            ) : (
              <CircleOutlined />
            )}
          </ListItemIcon>
          <Box sx={{ width: 'calc(100% - 36px)', textAlign: 'left' }}>
            <Typography>{item.name}</Typography>
            <DisplayId
              id={item.address}
              variant="body2"
              color="text.secondary"
            />
          </Box>
        </MenuItem>
      ))}
    </Dialog>
  );
};

export default AddressBookModal;
