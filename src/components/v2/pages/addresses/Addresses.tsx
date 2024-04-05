import HomeFrame from '../../layouts/HomeFrame';
import ListController from '../../components/ListController';
import AddressItem from './AddressItem';
import NewAddressForm from './NewAddressForm';
import { ADDRESSES } from '../../data';

const Addresses = () => {
  const getAddresses = () =>
    new Promise((resolve) => {
      resolve(ADDRESSES);
    });

  return (
    <HomeFrame>
      <ListController
        ListItem={<AddressItem name="" id="" amount={0} />}
        getData={getAddresses}
        divider={false}
        emptyTitle="You have no address yet!"
      />
      <NewAddressForm />
    </HomeFrame>
  );
};

export default Addresses;
