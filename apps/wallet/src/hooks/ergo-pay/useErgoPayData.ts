import { useEffect, useMemo, useState } from 'react';

import {
  ErgoPayResponse,
  ErgoPaySeverityEnum,
  LoadedErgoPayResponse,
  MultiAddressSupportedEnum,
} from '@minotaur-ergo/types';

import { getData, getDataMultiple } from '@/utils/ergopay';

const useErgoPayData = (
  url: string,
  supported: MultiAddressSupportedEnum,
  addresses: Array<string>,
  startLoad: boolean,
  tryCount: number,
): LoadedErgoPayResponse => {
  const [data, setData] = useState<ErgoPayResponse>({});
  const [loadedUrl, setLoadedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [tryIndex, setTryIndex] = useState(-1);
  useEffect(() => {
    const callback = (res: ErgoPayResponse) => {
      setData({ messageSeverity: ErgoPaySeverityEnum.Default, ...res });
      setLoadedUrl(url);
      setTryIndex(tryCount);
      setIsFailed(false);
      setLoading(false);
    };
    const catchCallback = (res: Error) => {
      setData({
        address: '',
        message: 'Failed to get data:\n' + res.message,
        messageSeverity: ErgoPaySeverityEnum.Error,
        reducedTx: '',
        replyTo: '',
      });
      setLoadedUrl(url);
      setTryIndex(tryCount);
      setIsFailed(true);
      setLoading(false);
    };
    if (!loading && (loadedUrl !== url || tryCount !== tryIndex)) {
      if (!url.startsWith('ergopay://')) {
        setLoading(true);
        callback({ reducedTx: url.substring(8) });
      } else if (supported === MultiAddressSupportedEnum.NOT_NEEDED) {
        setLoading(true);
        setData({
          address: '',
          message: 'Getting Data From ErgoPay URL',
        });
        getData(url, '').then(callback).catch(catchCallback);
      } else if (startLoad && addresses.length > 0) {
        if (supported === MultiAddressSupportedEnum.NOT_SUPPORTED) {
          setLoading(true);
          getData(url, addresses[0]).then(callback).catch(catchCallback);
        } else if (supported == MultiAddressSupportedEnum.SUPPORTED) {
          setLoading(true);
          getDataMultiple(url, addresses).then(callback).catch(catchCallback);
        }
      }
    }
  }, [
    url,
    supported,
    startLoad,
    addresses,
    loadedUrl,
    loading,
    tryCount,
    tryIndex,
  ]);
  return useMemo(() => {
    return {
      ...data,
      url: loadedUrl,
      failed: isFailed,
      loaded: loadedUrl === url,
      loading: loading,
    };
  }, [data, loadedUrl, isFailed, loading, url]);
};

export default useErgoPayData;
