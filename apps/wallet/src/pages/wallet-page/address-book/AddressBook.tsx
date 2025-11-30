import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';

import { SavedAddressDbAction } from '@/action/db';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import ListController from '@/components/list-controller/ListController';
import SavedAddress from '@/db/entities/SavedAddress';
import AppFrame from '@/layouts/AppFrame';
import { getRoute, RouteMap } from '@/router/routerMap';

import AddressBookItem from './AddressBookItem';

const AddressBook = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Array<SavedAddress>>([]);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  useEffect(() => {
    if (!valid) {
      setLoading(true);
      SavedAddressDbAction.getInstance()
        .getAllAddresses()
        .then((addresses) => {
          setAddresses(addresses);
          setLoading(false);
          setValid(true);
        });
    }
  }, [valid]);
  return (
    <AppFrame
      title="Address Book"
      navigation={<BackButtonRouter />}
      actions={
        <IconButton
          onClick={() => navigate(getRoute(RouteMap.WalletAddressBookAdd, {}))}
        >
          <AddIcon />
        </IconButton>
      }
    >
      <ListController
        loading={loading && addresses.length === 0}
        error={false}
        data={addresses}
        divider={false}
        emptyTitle={'You have no addresses '}
        render={(item) => (
          <AddressBookItem
            id={item.id}
            name={item.name}
            invalidate={() => setValid(false)}
            address={item.address}
          />
        )}
      />
    </AppFrame>
  );
};

export default AddressBook;
