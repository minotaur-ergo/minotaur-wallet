import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';

const ImportAddresses = () => {
  return (
    <AppFrame title="Import Address" navigation={<BackButton />}></AppFrame>
  );
};

export default ImportAddresses;
