import ContentPasteRounded from '@mui/icons-material/ContentPasteRounded';
import { Box, Button, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddressInput from '@/components/address-input/AddressInput';
import { Add, DeleteOutlineOutlined } from '@mui/icons-material';
import { NetworkPrefix } from 'ergo-lib-wasm-browser';

interface AddressesPropsType {
  addresses: Array<string>;
  setAddresses: React.Dispatch<React.SetStateAction<Array<string>>>;
  setHasError: (hasError: boolean) => unknown;
  network: NetworkPrefix;
}

const Addresses = (props: AddressesPropsType) => {
  const [errors, setErrors] = useState<Array<boolean>>([]);

  const setAddressAt = (index: number, address: string) => {
    const newAddresses = [...props.addresses];
    newAddresses[index] = address;
    props.setAddresses(newAddresses);
  };
  const deleteAddress = (index: number) => {
    const newAddresses = [...props.addresses];
    newAddresses.splice(index, 1);
    props.setAddresses(newAddresses);
  };
  const setHasErrorAt = (index: number, hasError: boolean) => {
    if (errors[index] !== hasError) {
      const newErrors = [...errors];
      newErrors[index] = hasError;
      setErrors(newErrors);
    }
  };
  const addAddress = () => {
    props.setAddresses([...props.addresses, '']);
  };
  const pasteAddresses = () => {
    console.log('paste clicked');
  };

  useEffect(() => {
    if (errors.length !== props.addresses.length) {
      setErrors(props.addresses.map(() => false));
    }
  }, [errors, props.addresses]);
  useEffect(() => {
    props.setHasError(errors.reduce((a, b) => a || b, false));
  }, [errors, props]);
  return (
    <React.Fragment>
      {props.addresses.map((address, index) => (
        <Box display="flex" sx={{ alignItems: 'center' }}>
          <AddressInput
            setHasError={(hasError) => setHasErrorAt(index, hasError)}
            setAddress={(value) => setAddressAt(index, value)}
            address={address}
            label={'Address #' + index}
            useAddressBook={false}
            showError={false}
            network={props.network}
          />
          {props.addresses.length > 1 ? (
            <IconButton edge="end" onClick={() => deleteAddress(index)}>
              <DeleteOutlineOutlined />
            </IconButton>
          ) : undefined}
        </Box>
      ))}
      <Box display="flex" sx={{ alignItems: 'center' }}>
        <Button variant="outlined" onClick={addAddress} startIcon={<Add />}>
          Add Address
        </Button>
        <Button
          variant="outlined"
          onClick={pasteAddresses}
          startIcon={<ContentPasteRounded />}
        >
          Bulk Paste
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default Addresses;
