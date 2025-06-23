import { StateWallet } from '@minotaur-ergo/types';
import React, { useContext, useState } from 'react';
import {
  IconButton,
  TextField,
  Collapse,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Add, Check, Close } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { deriveNewAddress } from '@/action/address';
import MessageContext from '@/components/app/messageContext';

import { invalidateAddresses } from '@/store/reducer/wallet';
import CircleButton from '@/components/circle-button/CircleButton';
import ActionContainer from '@/components/action-container/ActionContainer';

interface NewAddressPropsType {
  wallet: StateWallet;
}

const NewAddress = (props: NewAddressPropsType) => {
  const context = useContext(MessageContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleReset = () => {
    setOpen(false);
    setName('');
  };
  const handleNew = () => {
    if (open) {
      setLoading(true);
      deriveNewAddress(props.wallet, name)
        .then(() => {
          dispatch(invalidateAddresses());
          setLoading(false);
          handleReset();
        })
        .catch((err) => {
          context.insert(err.message, 'error');
          setLoading(false);
        });
    } else {
      setOpen(true);
    }
  };

  return (
    <ActionContainer paddingBottom="58px">
      <CircleButton onClick={handleNew} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : open ? <Check /> : <Add />}
      </CircleButton>
      <Collapse in={open} orientation={'horizontal'}>
        <TextField
          label="New Address Name"
          value={name}
          onChange={handleChangeName}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleReset} edge="end">
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Collapse>
    </ActionContainer>
  );
};

export default NewAddress;
