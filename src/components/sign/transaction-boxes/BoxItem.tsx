import { Box } from '@mui/material';
import { ReceiverTokenType } from '../../../types/sign-modal';
import DisplayId from '../../display-id/DisplayId';
import TokenAmount from '../../token-amount/TokenAmount';
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
      <Box sx={{ overflow: 'auto' }}>
        <DisplayId
          variant="body2"
          color="textSecondary"
          id={props.address}
          showAddress={true}
          customAddresses={props.wallet?.addresses ?? []}
        />
        <TokenAmount
          tokenId={'erg'}
          amount={props.amount}
          networkType={props.networkType}
        />
        {props.tokens.map((token) => (
          <TokenAmount
            key={token.id}
            tokenId={token.id}
            amount={token.amount}
            networkType={props.networkType}
          />
        ))}
      </Box>
    </Box>
  );
};

export default BoxItem;
