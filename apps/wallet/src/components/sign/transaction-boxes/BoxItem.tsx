import AssetRow from '@/components/asset-row/AssetRow';
import { Box, Stack } from '@mui/material';
import { ReceiverTokenType } from '@/types/sign-modal';
import DisplayId from '../../display-id/DisplayId';
import { StateWallet } from '@/store/reducer/wallet';

interface BoxItemPropsType {
  networkType: string;
  amount: bigint;
  address: string;
  tokens: Array<ReceiverTokenType>;
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
            key={token.id}
            id={token.id}
            amount={token.amount}
            networkType={props.networkType}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default BoxItem;
