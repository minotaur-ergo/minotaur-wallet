import { SavedAddressDbAction } from '@/action/db';
import { useEffect, useState } from 'react';

/**
 * A React hook that retrieves the name associated with an Ergo address.
 *
 * This hook first checks the database for a saved name for the given address.
 * If no name is found in the database, it then checks the provided custom addresses list.
 * The hook handles loading states and caches the result to prevent unnecessary database queries.
 *
 * @param address - The Ergo address to look up
 * @param customAddresses - An array of custom address objects with address and name properties
 * @returns The name associated with the address, or an empty string if no name is found
 */
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
