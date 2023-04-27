import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import ListController from '../../components/ListController';
import AddressBookItem from './AddressBookItem';
import { IconButton } from '@mui/material';
import { RouterMap } from '../../V2Demo';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const AddressBook = () => {
  const navigate = useNavigate();
  const getAddresses = () =>
    new Promise((resolve) => {
      resolve([
        {
          name: 'Address 1',
          amount: 60,
          id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2c25f',
        },
        {
          amount: 60,
          name: 'Address 2',
          id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7ef2c25f',
        },
      ]);
    });

  return (
    <AppFrame
      title="Address Book"
      navigation={<BackButton />}
      actions={
        <IconButton onClick={() => navigate(RouterMap.AddAddress)}>
          <AddIcon />
        </IconButton>
      }
    >
      <ListController
        ListItem={<AddressBookItem />}
        getData={getAddresses}
        divider={false}
        emptyTitle="You have no adr yet"
      />
    </AppFrame>
  );
};

export default AddressBook;
