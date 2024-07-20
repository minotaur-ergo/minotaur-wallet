import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import ListController from '../../components/ListController';
import AddressBookItem from './AddressBookItem';
import AddressBookMoreMenu from './AddressBookMoreMenu';
import { ADDRESS_BOOK } from '../../data';

const AddressBook = () => {
  const getAddresses = () =>
    new Promise((resolve) => {
      resolve(ADDRESS_BOOK);
    });

  return (
    <AppFrame
      title="Address Book"
      navigation={<BackButton />}
      actions={<AddressBookMoreMenu />}
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
