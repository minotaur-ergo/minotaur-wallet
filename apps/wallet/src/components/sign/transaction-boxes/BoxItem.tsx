import { StateWallet, TokenBalanceBigInt } from '@minotaur-ergo/types';
import { Box, Stack } from '@mui/material';

import AssetRow from '@/components/asset-row/AssetRow';

import DisplayId from '../../display-id/DisplayId';

interface BoxItemPropsType {
  networkType: string;
  amount: bigint;
  address: string;
  tokens: Array<TokenBalanceBigInt>;
  wallet?: StateWallet;
}

const BoxItem = (props: BoxItemPropsType) => {
  return (
    <Box display="flex" sx={{ gap: 1 }}>
      <Box
        sx={{
          width: 8,
          m: 0.5,
          borderRadius: 4,
          opacity: 0.5,
          bgcolor: 'primary.light',
        }}
      />
      <Stack spacing={1} style={{ flexGrow: 1 }} sx={{ overflow: 'auto' }}>
        <DisplayId
          variant="body2"
          color="textSecondary"
          id={props.address}
          showAddress={true}
          customAddresses={props.wallet?.addresses ?? []}
        />
        <AssetRow id="" amount={props.amount} networkType={props.networkType} />
        {props.tokens.map((token) => (
          <AssetRow
            key={token.tokenId}
            id={token.tokenId}
            amount={token.balance}
            networkType={props.networkType}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default BoxItem;
