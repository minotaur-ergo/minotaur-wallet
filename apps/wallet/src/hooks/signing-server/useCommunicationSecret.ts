import { ServerDbAction } from '@/action/db';
import Server from '@/db/entities/Server';
import { useEffect, useState } from 'react';

const useCommunicationSecret = (walletId: number, timestamp: number) => {
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedWallet, setLoadedWallet] = useState<number>(-1);
  const [loadedTimestamp, setLoadedTimestamp] = useState<number>(0);
  useEffect(() => {
    if (
      !loading &&
      (loadedWallet !== walletId || timestamp > loadedTimestamp)
    ) {
      setLoading(true);
      const [newTimestamp, newWalletId] = [timestamp, walletId];
      ServerDbAction.getInstance()
        .getWalletServer(walletId)
        .then((res) => {
          setLoadedWallet(newWalletId);
          setLoadedTimestamp(newTimestamp);
          setServer(res);
          setLoading(false);
        });
    }
  }, [loadedTimestamp, loadedWallet, loading, timestamp, walletId]);
  return {
    server,
    loading,
  };
};

export default useCommunicationSecret;
