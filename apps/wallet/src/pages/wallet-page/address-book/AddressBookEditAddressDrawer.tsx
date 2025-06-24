import { ChangeEvent, useContext, useState } from 'react';

import { QrCodeScanner } from '@mui/icons-material';
import {
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { SavedAddressDbAction } from '@/action/db';
import { QrCodeContext } from '@/components/qr-code-scanner/QrCodeContext';

interface AddressBookEditAddressDrawerPropsType {
  editing: boolean;
  close: (invalidate: boolean) => unknown;
  name: string;
  address: string;
  id: number;
}

const AddressBookEditAddressDrawer = (
  props: AddressBookEditAddressDrawerPropsType,
) => {
  const [values, setValues] = useState({
    name: props.name,
    address: props.address,
  });
  const qrcode = useContext(QrCodeContext);

  const handleConfirmEdit = () => {
    SavedAddressDbAction.getInstance()
      .updateEntity(props.id, values.name, values.address)
      .then(() => {
        props.close(true);
      });
  };

  const handleChangeValue =
    (fieldName: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prevState) => ({
        ...prevState,
        [fieldName]: event.target.value,
      }));
    };

  const handleCancel = () => {
    setValues({ name: props.name, address: props.address });
    props.close(false);
  };
  const startScan = () => {
    qrcode
      .start()
      .then((value) =>
        setValues((prevState) => ({ ...prevState, address: value })),
      )
      .catch((exp) => console.log(exp));
  };
  return (
    <Drawer anchor="bottom" open={props.editing}>
      <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
        Edit Address
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Name"
          variant="standard"
          value={values.name}
          onChange={handleChangeValue('name')}
          inputProps={{ autoFocus: true }}
        />
        <TextField
          label="Address"
          variant="standard"
          value={values.address}
          onChange={handleChangeValue('address')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={startScan}>
                  <QrCodeScanner />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack direction="row-reverse" spacing={2}>
        <Button
          onClick={handleConfirmEdit}
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
  );
};

export default AddressBookEditAddressDrawer;
