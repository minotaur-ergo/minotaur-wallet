import { useContext, useEffect, useState } from 'react';

import { StateWallet } from '@minotaur-ergo/types';
import { createEmptyArray } from '@minotaur-ergo/utils';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  FormHelperText,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import { newEmptyReceiver } from '@/action/tx';
import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import TxGenerateContext from '@/components/sign/context/TxGenerateContext';

import ReceiverForm from './ReceiverForm';

interface SendAmountPropsType {
  wallet: StateWallet;
  setHasError: (hasError: boolean) => unknown;
}

const SendAmount = (props: SendAmountPropsType) => {
  const generatorContext = useContext(TxGenerateContext);
  const [receiverErrors, setReceiverErrors] = useState<Array<boolean>>([]);
  const handleChangeSelectedAddresses = (
    event: SelectChangeEvent<Array<string>>,
  ) => {
    const value = event.target.value;
    if (value === 'all') {
      generatorContext.setSelectedAddresses('all');
    } else {
      if (typeof value === 'string') {
        generatorContext.setSelectedAddresses([value as string]);
      } else {
        generatorContext.setSelectedAddresses(value as Array<string>);
      }
    }
  };

  const handleSetHasErrorAtIndex = (index: number) => (hasError: boolean) => {
    if (receiverErrors.length > index && receiverErrors[index] !== hasError) {
      const newReceiverErrors = [...receiverErrors];
      newReceiverErrors[index] = hasError;
      setReceiverErrors(newReceiverErrors);
    }
  };

  useEffect(() => {
    if (generatorContext.ready) {
      generatorContext.setReady(false);
    }
  }, [generatorContext, generatorContext.ready]);
  useEffect(() => {
    if (receiverErrors.length !== generatorContext.receivers.length) {
      setReceiverErrors(
        createEmptyArray(generatorContext.receivers.length, false),
      );
    } else {
      props.setHasError(receiverErrors.reduce((a, b) => a || b, false));
    }
  }, [receiverErrors, generatorContext.receivers.length, props]);
  return (
    <Box>
      <FormControl>
        <InputLabel id="demo-simple-select-label">From Address</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={
            generatorContext.selectedAddresses === 'all'
              ? ['all']
              : generatorContext.selectedAddresses
          }
          onChange={handleChangeSelectedAddresses}
        >
          <MenuItem value={'all'}>All Addresses</MenuItem>
          {props.wallet.addresses.map((address) => (
            <MenuItem key={address.id} value={`${address.id}`}>
              {address.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText sx={{ fontSize: '1rem' }}>
          <ErgAmountDisplay amount={generatorContext.total} />
          &nbsp;Erg available
        </FormHelperText>
      </FormControl>

      <Stack spacing={3} sx={{ mb: 3, mt: 2 }}>
        {generatorContext.receivers.map((_receiver, index) => (
          <ReceiverForm
            index={index}
            setHasError={handleSetHasErrorAtIndex(index)}
            wallet={props.wallet}
            key={index}
            title={`Receiver ${index + 1}`}
          />
        ))}
      </Stack>

      <Button
        variant="outlined"
        onClick={() =>
          generatorContext.setReceivers([
            ...generatorContext.receivers,
            newEmptyReceiver(),
          ])
        }
        startIcon={<AddIcon />}
      >
        Add more receiver
      </Button>
    </Box>
  );
};

export default SendAmount;
