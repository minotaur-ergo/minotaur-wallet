import { SavedAddressDbAction } from '@/action/db';
import { useEffect, useState } from 'react';

const useAddressName = (
  address: string,
  customAddresses: Array<{ address: string; name: string }>,
) => {
  const [name, setName] = useState('');
  const [loadedAddress, setLoadedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) {
      if (loadedAddress !== address) {
        const loadingAddress = address;
        setLoading(true);
        SavedAddressDbAction.getInstance()
          .getAddressName(address)
          .then((name) => {
            if (!name) {
              const filtered = customAddresses.filter(
                (item) => item.address === address,
              );
              if (filtered.length > 0) {
                name = filtered[0].name;
              }
            }
            setName(name ? name : '');
            setLoadedAddress(loadingAddress);
            setLoading(false);
          });
      }
    }
  }, [loading, loadedAddress, address, customAddresses]);
  return name;
};

export default useAddressName;
