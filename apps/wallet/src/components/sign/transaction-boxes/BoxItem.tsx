import { StateWallet, TokenBalanceBigInt } from '@minotaur-ergo/types';
import { Stack } from '@mui/material';

import DisplayId from '@/components/display-id/DisplayId';

import BoxAssetRow from './BoxAssetRow';

interface BoxItemPropsType {
  networkType: string;
  amount: bigint;
  address: string;
  tokens: Array<TokenBalanceBigInt>;
  wallet?: StateWallet;
}

const BoxItem = (props: BoxItemPropsType) => {
  return (
    <Stack
      spacing={1.25}
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        border: '1px solid',
        borderColor: '#C8C8C8',
        borderRadius: '12px',
        p: 1.5,
      }}
    >
      <DisplayId
        variant="body2"
        color="textSecondary"
        id={props.address}
        showAddress={true}
        customAddresses={props.wallet?.addresses ?? []}
      />

      <BoxAssetRow
        id=""
        amount={props.amount}
        networkType={props.networkType}
      />
      {props.tokens.map((token) => (
        <BoxAssetRow
          key={token.tokenId}
          id={token.tokenId}
          amount={token.balance}
          networkType={props.networkType}
        />
      ))}
    </Stack>
  );
};

export default BoxItem;
