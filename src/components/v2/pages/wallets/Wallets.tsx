import { useEffect, useMemo, useRef, useState } from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { Box, FormControlLabel, Stack, Switch } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TotalBalanceCard from './components/TotalBalanceCard';
import Heading from '../../components/Heading';
import WalletItem from './components/WalletItem';
import SnackAlert, { SnackAlertHandle } from '../../components/SnackAlert';
import { WALLET_GROUPS, WALLETS } from '../../data';
import SubHeading from '../../components/SubHeading';
import WalletsMoreMenu from './WalletsMoreMenu';
import { WalletType } from '../../models';
import WalletGroup from './components/WalletGroup';

const Wallets = () => {
  const location = useLocation();
  const alert = useRef<SnackAlertHandle>(null);
  const [showArchived, setShowArchived] = useState<boolean>(() => {
    const storedValue = localStorage.getItem('showArchived');
    return storedValue ? JSON.parse(storedValue) : false;
  });
  const [wallets, setWallets] = useState<WalletType[]>(WALLETS);

  const [favoriteWallets, groupedWallets, otherWallets] = useMemo(() => {
    const filteredWalletsByArchive = wallets.filter(
      (row) => showArchived || !row.archived
    );
    return [
      filteredWalletsByArchive.filter((row) => row.favorite),
      filteredWalletsByArchive.filter((row) => row.groupId),
      filteredWalletsByArchive.filter((row) => !row.favorite && !row.groupId),
    ];
  }, [showArchived, wallets]);

  const groups = useMemo(() => {
    const groupMap: Record<string, WalletType[]> = {};
    groupedWallets.forEach((wallet) => {
      if (!groupMap[wallet.groupId!]) {
        groupMap[wallet.groupId!] = [];
      }
      groupMap[wallet.groupId!].push(wallet);
    });
    return Object.entries(groupMap).map(([id, wallets]) => ({
      id,
      name:
        WALLET_GROUPS.find((group) => group.id === id)?.name || `Group ${id}`,
      amount: wallets.reduce((sum, wallet) => sum + wallet.amount, 0),
      value: wallets.reduce((sum, wallet) => sum + wallet.value, 0),
      numberOfTokens: wallets.reduce(
        (sum, wallet) => sum + (wallet.numberOfTokens || 0),
        0
      ),
      wallets,
    }));
  }, [groupedWallets]);

  const toggleFavorite = (id: string) => {
    const index = wallets.findIndex((row) => row.id === id);
    const newWallets = Object.assign([...wallets], {
      [index]: {
        ...wallets[index],
        favorite: !wallets[index].favorite,
      },
    });
    setWallets(newWallets);
  };

  useEffect(() => {
    if (location.state) {
      alert.current?.setMessage(location.state.message);
      alert.current?.open();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('showArchived', JSON.stringify(showArchived));
  }, [showArchived]);

  return (
    <AppFrame
      title="My Wallets"
      navigation={<BackButton />}
      actions={<WalletsMoreMenu />}
    >
      <TotalBalanceCard />

      <Heading
        title="Wallets List"
        customActions={
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
            }
            label={<small>Show archived</small>}
          />
        }
      />

      {favoriteWallets.length > 0 && (
        <>
          <SubHeading title="Favorites" disableTopGutter />
          <Stack spacing={2}>
            {favoriteWallets.map((item, index) => (
              <WalletItem
                {...item}
                key={index}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </Stack>
          {otherWallets.length + groups.length > 0 && (
            <SubHeading title="Others" />
          )}
        </>
      )}
      <Box display="flex" flexDirection="column" gap={2}>
        {groups.map((item, index) => (
          <WalletGroup {...item} key={index} />
        ))}
        {otherWallets.map((item, index) => (
          <WalletItem {...item} key={index} toggleFavorite={toggleFavorite} />
        ))}
      </Box>

      <SnackAlert ref={alert} />
    </AppFrame>
  );
};

export default Wallets;
