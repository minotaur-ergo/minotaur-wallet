import { useState } from 'react';
import { Drawer } from '@mui/material';
import { useDispatch } from 'react-redux';
import { invalidateAddresses, StateAddress } from '@/store/reducer/wallet';
import { ChainTypeInterface } from '@minotaur-ergo/types';
import AddressViewCard from './AddressViewCard';
import AddressEditCard from './AddressEditCard';
import { AddressDbAction } from '@/action/db';
import AddressItemDisplay from './AddressItemDisplay';

interface AddressItemPropsType {
  address: StateAddress;
  chain: ChainTypeInterface;
}

const AddressItem = (props: AddressItemPropsType) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  const setName = (newName: string) => {
    setEditing(false);
    setOpen(false);
    AddressDbAction.getInstance()
      .updateAddressName(props.address.id, newName)
      .then(() => {
        dispatch(invalidateAddresses());
      });
  };
  return (
    <AddressItemDisplay
      onClick={() => setOpen(true)}
      address={props.address}
      chain={props.chain}
    >
      <Drawer
        anchor="bottom"
        open={open && !editing}
        onClose={() => setOpen(false)}
      >
        <AddressViewCard
          address={props.address}
          name={props.address.name}
          isDefault={props.address.isDefault}
          chain={props.chain}
          handleEdit={() => setEditing(true)}
          handleClose={() => setOpen(false)}
        />
      </Drawer>

      <Drawer anchor="bottom" open={editing}>
        <AddressEditCard
          name={props.address.name}
          setName={setName}
          handleCancel={() => setEditing(false)}
        />
      </Drawer>
    </AddressItemDisplay>
  );
};

export default AddressItem;
