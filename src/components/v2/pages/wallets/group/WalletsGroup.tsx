import { Box, Button, Typography } from '@mui/material';
import BackButton from '../../../components/BackButton';
import AppFrame from '../../../layouts/AppFrame';
import { useParams } from 'react-router-dom';
import { WALLET_GROUPS, WALLETS } from '../../../data';
import { useMemo, useState } from 'react';
import { WalletType } from '../../../models';
import WalletItem from '../components/WalletItem';
import WalletsGroupMoreMenu from './WalletsGroupMoreMenu';

export default function WalletsGroup() {
  const { id } = useParams();
  const groupName =
    WALLET_GROUPS.find((group) => group.id === id)?.name || `Group ${id}`;

  const [showArchived, setShowArchived] = useState<boolean>(() => {
    const storedValue = localStorage.getItem('showArchived');
    return storedValue ? JSON.parse(storedValue) : false;
  });

  const [wallets, setWallets] = useState<WalletType[]>(
    WALLETS.filter((wallet) => wallet.groupId === id)
  );

  const displayWallets = useMemo(
    () => wallets.filter((row) => showArchived || !row.archived),
    [showArchived, wallets]
  );

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

  return (
    <AppFrame
      title={groupName}
      navigation={<BackButton />}
      actions={
        <WalletsGroupMoreMenu
          setShowArchived={setShowArchived}
          showArchived={showArchived}
        />
      }
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {displayWallets.map((item, index) => (
          <WalletItem {...item} key={index} toggleFavorite={toggleFavorite} />
        ))}
      </Box>
    </AppFrame>
  );
}
