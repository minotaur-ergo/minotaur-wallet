import { useEffect, useMemo, useRef, useState } from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { FormControlLabel, Stack, Switch } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TotalBalanceCard from './components/TotalBalanceCard';
import Heading from '../../components/Heading';
import WalletItem from './components/WalletItem';
import SnackAlert, { SnackAlertHandle } from '../../components/SnackAlert';
import { WALLETS } from '../../data';
import SubHeading from '../../components/SubHeading';
import WalletsMoreMenu from './WalletsMoreMenu';

const Wallets = () => {
  const location = useLocation();
  const alert = useRef<SnackAlertHandle>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [wallets, setWallets] = useState(WALLETS);

  const [favoriteWallets, otherWallets] = useMemo(() => {
    const filteredWalletsByArchive = wallets.filter(
      (row) => showArchived || !row.archived
    );
    return [
      filteredWalletsByArchive.filter((row) => row.favorite),
      filteredWalletsByArchive.filter((row) => !row.favorite),
    ];
  }, [showArchived, wallets]);

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
          {otherWallets.length > 0 && <SubHeading title="Others" />}
        </>
      )}
      <Stack spacing={2}>
        {otherWallets.map((item, index) => (
          <WalletItem {...item} key={index} toggleFavorite={toggleFavorite} />
        ))}
      </Stack>

      <SnackAlert ref={alert} />
    </AppFrame>
  );
};

export default Wallets;
