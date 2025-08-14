import { useEffect, useState } from 'react';

import { CapacitorHttp } from '@capacitor/core';
import {
  MultiAddressSupportedEnum,
  MultipleAddressResponse,
} from '@minotaur-ergo/types';

import { ADDRESS_PLACE_HOLDER } from '@/utils/const';
import { getUrl } from '@/utils/ergopay';

const calcMultipleAddressSupported = async (
  url: string,
  setState: (state: MultipleAddressResponse) => unknown,
): Promise<void> => {
  const cleanDescription = (supported: MultiAddressSupportedEnum) =>
    setState({ title: '', description: [], severity: '', supported });
  if (url.indexOf(ADDRESS_PLACE_HOLDER) === -1) {
    cleanDescription(MultiAddressSupportedEnum.NOT_NEEDED);
    return;
  }
  setState({
    supported: MultiAddressSupportedEnum.NOT_CHECKED,
    title: 'Please wait',
    description: ['Checking if backend Supported Multiple Addresses'],
    severity: '',
  });
  try {
    const response = await CapacitorHttp.post({
      url: getUrl(url, 'multiple_check'),
    });
    const status = Math.floor(response.status / 100);
    const supported = [3, 4, 5].includes(status)
      ? MultiAddressSupportedEnum.NOT_SUPPORTED
      : status === 2
        ? MultiAddressSupportedEnum.SUPPORTED
        : MultiAddressSupportedEnum.FAILED;
    if (supported === MultiAddressSupportedEnum.FAILED) {
      setState({
        title: 'Failed',
        description: [
          `Error During Checking Multiple Address Supported`,
          response.data ? `${response.data}` : '',
        ],
        severity: 'error',
        supported: supported,
      });
    } else {
      cleanDescription(supported);
    }
  } catch (e) {
    setState({
      title: 'Failed',
      description: [`Error During Checking Multiple Address Supported`, `${e}`],
      severity: 'error',
      supported: MultiAddressSupportedEnum.FAILED,
    });
  }
};
const useMultiAddressSupported = (
  url: string,
  tryCount: number,
): MultipleAddressResponse => {
  const [loadedUrl, setLoadedUrl] = useState('');
  const [usedTryCount, setUsedTryCount] = useState(0);
  const [response, setResponse] = useState<MultipleAddressResponse>({
    title: '',
    description: [],
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
        setLoading(true);
        setUsedTryCount(tryCount);
        setLoadedUrl(url);
        calcMultipleAddressSupported(url, setResponse)
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      }
    }
  }, [loadedUrl, loading, url, tryCount, usedTryCount, response]);
  return response;
};

export default useMultiAddressSupported;
