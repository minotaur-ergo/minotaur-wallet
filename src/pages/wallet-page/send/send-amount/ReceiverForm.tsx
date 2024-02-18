import { Box, Button, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import AddressInput from '@/components/address-input/AddressInput';
import txGenerateContext from '@/components/sign/context/TxGenerateContext';
import TokenAmountInput from '@/components/token-amount-input/TokenAmountInput';
import { StateWallet } from '@/store/reducer/wallet';
import { FEE, MIN_BOX_VALUE } from '@/utils/const';
import TokenSelect from './TokenSelect';

interface ReceiverFormPropsType {
  index: number;
  title: string;
  setHasError: (hasError: boolean) => unknown;
  wallet: StateWallet;
}

const ReceiverForm = (props: ReceiverFormPropsType) => {
  const generatorContext = useContext(txGenerateContext);
  const [addressError, setAddressError] = useState(true);
  const content = generatorContext.receivers[props.index];
  const remove = () => {
    const newReceiver = [...generatorContext.receivers];
    newReceiver.splice(props.index, 1);
    generatorContext.setReceivers(newReceiver);
  };
  const setTokenAmount = (index: number) => (value: bigint) => {
    const newTokens = [...content.tokens];
    newTokens[index] = { ...newTokens[index], amount: value };
    generatorContext.edit(props.index, { tokens: newTokens });
  };

  const getTokenAmount = (tokenId: string) => {
    const usedToken = generatorContext.receivers
      .map((receiver, index) =>
        index === props.index
          ? 0n
          : receiver.tokens
              .filter((token) => token.id === tokenId)
              .reduce((a, b) => a + b.amount, 0n),
      )
      .reduce((a, b) => a + b, 0n);
    return (generatorContext.tokens[tokenId] || 0n) - usedToken;
  };

  const updateAddressError = (hasError: boolean) => {
    if (addressError !== hasError) {
      setAddressError(hasError);
    }
  };

  useEffect(() => {
    props.setHasError(addressError || content.amount <= MIN_BOX_VALUE);
  });
  const totalUsed = generatorContext.receivers
    .map((item) => item.amount)
    .reduce((a, b) => a + b, 0n);
  return (
    <Stack spacing={2}>
      <Box sx={{ px: 1, display: 'flex' }}>
        <Typography sx={{ flexGrow: 1 }}>{props.title}</Typography>
        {generatorContext.receivers.length > 1 ? (
          <Button
            variant="text"
            fullWidth={false}
            sx={{ p: 0 }}
            onClick={remove}
          >
            Remove
          </Button>
        ) : null}
      </Box>
      <AddressInput
        setHasError={updateAddressError}
        setAddress={(value) =>
          generatorContext.edit(props.index, { address: value })
        }
        address={content.address}
        label="Receiver Address"
      />
      <TokenAmountInput
        network_type={props.wallet.networkType}
        amount={content.amount}
        setAmount={(newAmount) =>
          generatorContext.edit(props.index, { amount: newAmount })
        }
        total={generatorContext.total - FEE - totalUsed + content.amount}
        tokenId="erg"
      />
      <TokenSelect index={props.index} wallet={props.wallet} />
      {content.tokens.map((token, index) => (
        <TokenAmountInput
          key={token.id}
          network_type={props.wallet.networkType}
          amount={token.amount}
          setAmount={setTokenAmount(index)}
          total={getTokenAmount(token.id)}
          tokenId={token.id}
        />
      ))}
    </Stack>
  );
};

export default ReceiverForm;
