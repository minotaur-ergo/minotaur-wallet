import React from 'react';
import HomeFrame from '../../layouts/HomeFrame';
import { Button, SpeedDial, SpeedDialIcon } from '@mui/material';
import ListController from '../../components/ListController';
import AddressItem from './AddressItem';

const Addresses = () => {
  const getAddresses = () =>
    new Promise((resolve) => {
      resolve([
        {
          name: 'Main Address',
          amount: 60,
          id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2c25f',
        },
        {
          name: 'Secondary Address',
          amount: 0,
          id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2c25f',
        },
      ]);
    });
  return (
    <HomeFrame>
      <ListController
        ListItem={<AddressItem />}
        getData={getAddresses}
        divider={false}
        emptyTitle="You have no adr yet"
      />

      <Button variant="text" sx={{ mt: 3 }}>
        Display extended public key
      </Button>

      <SpeedDial
        ariaLabel="Create new address"
        sx={{ position: 'absolute', bottom: 16 + 75, right: 16 }}
        icon={<SpeedDialIcon />}
      ></SpeedDial>
    </HomeFrame>
  );
};

export default Addresses;
