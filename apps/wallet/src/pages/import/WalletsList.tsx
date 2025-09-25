import { useContext } from 'react';

import { ImportProcessingState } from '@minotaur-ergo/types';
import { Stack } from '@mui/material';

import { ImportWalletContext } from '@/pages/import/importWalletContext';
import WalletImportItem from '@/pages/import/WalletImportItem';

const WalletsList = () => {
  const context = useContext(ImportWalletContext);
  if (context.status !== ImportProcessingState.NoData) {
    return (
      <Stack gap={2}>
        {context.data.map((_item, index) => (
          <WalletImportItem key={index} index={index} />
        ))}
      </Stack>
    );
  }
};

export default WalletsList;
