import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Add, CircleOutlined, RadioButtonChecked } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  ListItemIcon,
  MenuItem,
  Typography,
} from '@mui/material';

import { SavedAddressDbAction } from '@/action/db';
import DisplayId from '@/components/display-id/DisplayId';
import StateMessage from '@/components/state-message/StateMessage';
import SavedAddress from '@/db/entities/SavedAddress';
import SvgIcon from '@/icons/SvgIcon';
import { RouteMap } from '@/router/routerMap';

interface AddressBookModalPropsType {
  open: boolean;
  onClose: () => void;
  onChange?: (contact: SavedAddress) => void;
  address?: string;
}

const AddressBookModal = (props: AddressBookModalPropsType) => {
  const navigate = useNavigate();
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
    <Drawer open={props.open} onClose={props.onClose} anchor="bottom">
      <Typography variant="h3" mt={1} mb={2}>
        Select Address
      </Typography>
      {addresses.length === 0 ? (
        <StateMessage
          title="No record"
          description="You don’t have any addresses in your address book yet!"
          icon={<SvgIcon icon="document" color="secondary" />}
          color="secondary.dark"
          action={
            <Button
              variant="text"
              size="small"
              startIcon={<Add />}
              onClick={() => navigate(RouteMap.WalletAddressBookAdd)}
            >
              Add first address
            </Button>
          }
        />
      ) : (
        <Typography color="textSecondary" mb={2}>
          Select an address from your address book.
        </Typography>
      )}
      {addresses.map((item, index) => (
        <MenuItem key={index} onClick={handleSelect(item)} disableGutters>
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
    </Drawer>
  );
};

export default AddressBookModal;
