import { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { TokenType } from './TokenItem';
import AddressItemCard from './AddressItemCard';
import AddressItemDrawer from './AddressItemDrawer';

interface PropsType {
  name: string;
  amount: number;
  id: string;
  isDefault?: boolean;
  tokens?: TokenType[];
}

export default function ({
  name,
  amount,
  id,
  isDefault = false,
  tokens = [] as TokenType[],
}: PropsType) {
  const [open, setOpen] = useState(false);
  const numberOfTokens = useMemo(() => tokens?.length || 0, [tokens]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <AddressItemCard
        name={name}
        amount={amount}
        id={id}
        numberOfTokens={numberOfTokens}
        isDefault={isDefault}
        handleOpen={handleOpen}
      />
      <AddressItemDrawer
        name={name}
        id={id}
        tokens={tokens}
        isDefault={isDefault}
        open={open}
        handleClose={handleClose}
      />
    </Box>
  );
}
