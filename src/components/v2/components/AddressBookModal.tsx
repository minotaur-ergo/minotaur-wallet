import {
  Box,
  Dialog,
  DialogTitle,
  ListItemIcon,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { AddressBookType } from '../models';
import { ADDRESS_BOOK } from '../data';
import DisplayId from './DisplayId';
import { CircleOutlined, RadioButtonChecked } from '@mui/icons-material';

interface PropsType {
  open: boolean;
  onClose: () => void;
  onChange?: (contact: AddressBookType) => void;
  address?: string;
}

export default function AddressBookModal({
  onClose,
  open,
  onChange,
  address,
}: PropsType) {
  const [addresses, setAddresses] = React.useState<AddressBookType[]>([]);

  const handleSelect = (item: AddressBookType) => () => {
    if (onChange) onChange(item);
    onClose();
  };

  useEffect(() => {
    setAddresses(ADDRESS_BOOK);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{ sx: { pb: 2 } }}
    >
      <DialogTitle>Select From Address Book</DialogTitle>
      {addresses.map((item, index) => (
        <MenuItem key={index} onClick={handleSelect(item)}>
          <ListItemIcon>
            {item.address === address ? (
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
}
