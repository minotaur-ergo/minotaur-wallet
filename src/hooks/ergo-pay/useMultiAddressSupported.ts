import {
  MultiAddressSupportedEnum,
  MultipleAddressResponse,
} from '@/types/ergopay';
import { ADDRESS_PLACE_HOLDER } from '@/utils/const';
import { getUrl } from '@/utils/ergopay';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

const useMultiAddressSupported = (
  url: string,
  tryCount: number,
): MultipleAddressResponse => {
  const [loadedUrl, setLoadedUrl] = useState('');
  const [usedTryCount, setUsedTryCount] = useState(0);
  const [response, setResponse] = useState<MultipleAddressResponse>({
    title: '',
    description: [''],
    severity: '',
    supported: MultiAddressSupportedEnum.NOT_CHECKED,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) {
      if (
        url !== loadedUrl ||
        (usedTryCount !== tryCount &&
          response.supported === MultiAddressSupportedEnum.FAILED)
      ) {
        const cleanDescription = (supported: MultiAddressSupportedEnum) =>
          setResponse({ title: '', description: [], severity: '', supported });
        setLoading(true);
        setUsedTryCount(tryCount);
        if (url.indexOf(ADDRESS_PLACE_HOLDER) !== -1) {
          const loadingUrl = url;
          setResponse({
            supported: MultiAddressSupportedEnum.NOT_CHECKED,
            title: 'Please wait',
            description: ['Checking if backend Supported Multiple Addresses'],
            severity: '',
          });
          axios
            .post(getUrl(loadingUrl, 'multiple_check'))
            .then(() => {
              setLoadedUrl(loadingUrl);
              cleanDescription(MultiAddressSupportedEnum.SUPPORTED);
              setLoading(false);
            })
            .catch((res: AxiosError) => {
              let newSupported = MultiAddressSupportedEnum.FAILED;
              if (res.response && res.response.status) {
                const status = Math.floor(res.response.status / 100);
                if ([3, 4, 5].includes(status))
                  newSupported = MultiAddressSupportedEnum.NOT_SUPPORTED;
              }
              if (newSupported === MultiAddressSupportedEnum.FAILED) {
                setResponse({
                  title: 'Failed',
                  description: [
                    `Error During Checking Multiple Address Supported`,
                    res.message ? res.message : '',
                  ],
                  severity: 'error',
                  supported: newSupported,
                });
              } else {
                cleanDescription(newSupported);
              }
              setLoadedUrl(loadingUrl);
              setLoading(false);
            });
        } else {
          cleanDescription(MultiAddressSupportedEnum.NOT_NEEDED);
          setLoading(false);
          setLoadedUrl(url);
        }
      }
    }
  }, [loadedUrl, loading, url, tryCount, usedTryCount, response]);
  return response;
};

export default useMultiAddressSupported;
