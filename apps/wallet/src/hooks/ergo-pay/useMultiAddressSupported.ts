import { useEffect, useState } from 'react';

import { CapacitorHttp } from '@capacitor/core';
import {
  MultiAddressSupportedEnum,
  MultipleAddressResponse,
} from '@minotaur-ergo/types';

import { ADDRESS_PLACE_HOLDER } from '@/utils/const';
import { getUrl } from '@/utils/ergopay';

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
          CapacitorHttp.post({
            url: getUrl(loadingUrl, 'multiple_check'),
          })
            .then((res) => {
              let newSupported = MultiAddressSupportedEnum.FAILED;
              const status = Math.floor(res.status / 100);
              if ([3, 4, 5].includes(status)) {
                newSupported = MultiAddressSupportedEnum.NOT_SUPPORTED;
              } else if (status === 2) {
                newSupported = MultiAddressSupportedEnum.SUPPORTED;
              }
              if (newSupported === MultiAddressSupportedEnum.FAILED) {
                setResponse({
                  title: 'Failed',
                  description: [
                    `Error During Checking Multiple Address Supported`,
                    res.data ? res.data : '',
                  ],
                  severity: 'error',
                  supported: newSupported,
                });
              } else {
                cleanDescription(newSupported);
              }
              setLoadedUrl(loadingUrl);
              setLoading(false);
            })
            .catch((err) => {
              setResponse({
                title: 'Failed',
                description: [
                  `Error During Checking Multiple Address Supported`,
                  err,
                ],
                severity: 'error',
                supported: MultiAddressSupportedEnum.FAILED,
              });
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
