import Server from '@/db/entities/Server';
import { StateWallet } from '@/store/reducer/wallet';
import { RegisteredTeam } from '@/types/multi-sig-server';
import { useEffect, useState } from 'react';
import { getTeams } from '@/action/multi-sig-server';

const useRegisteredTeam = (
  server?: Server | null,
  wallet?: StateWallet | null,
  signer?: StateWallet,
) => {
  const [team, setTeam] = useState<RegisteredTeam | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverId, setServerId] = useState(-1);
  const [walletId, setWalletId] = useState(-1);
  useEffect(() => {
    if (
      signer &&
      server &&
      wallet &&
      !loading &&
      (server.id !== serverId || wallet.id !== walletId)
    ) {
      setLoading(true);
      const loadingServerId = server.id;
      const loadingWalletId = wallet.id;
      getTeams(server, wallet, signer.xPub).then((res) => {
        setTeam(res ?? null);
        setServerId(loadingServerId);
        setWalletId(loadingWalletId);
        setLoading(false);
      });
    }
  }, [server, wallet, loading, serverId, walletId, signer]);
  return {
    team,
    loading,
  };
};

export default useRegisteredTeam;
