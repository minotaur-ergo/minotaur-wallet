import { Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { useContext } from 'react';
import { SavedAddressDbAction } from '@/action/db';
import MessageContext from '@/components/app/messageContext';

interface AddressBookDeleteAddressDrawerPropsType {
  deleting: boolean;
  close: (invalidate: boolean) => unknown;
  id: number;
}

const AddressBookDeleteAddressDrawer = (
  props: AddressBookDeleteAddressDrawerPropsType,
) => {
  const context = useContext(MessageContext);
  const handleConfirmDelete = () => {
    SavedAddressDbAction.getInstance()
      .deleteEntity(props.id)
      .then(() => {
        props.close(true);
      })
      .catch((exp) => {
        context.insert(exp, 'error');
      });
  };

  return (
    <Drawer anchor="bottom" open={props.deleting}>
      <Typography fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
        Remove Address
      </Typography>
      <Typography>Are you sure?</Typography>
      <Stack direction="row-reverse" spacing={2}>
        <Button
          onClick={handleConfirmDelete}
          variant="text"
          fullWidth={false}
          sx={{ px: 0, minWidth: 0 }}
        >
          Remove
        </Button>
        <Button
          onClick={() => props.close(false)}
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

export default AddressBookDeleteAddressDrawer;
