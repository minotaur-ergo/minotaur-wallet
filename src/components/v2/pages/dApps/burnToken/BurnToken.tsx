import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import BackButton from '../../../components/BackButton';
import AppFrame from '../../../layouts/AppFrame';
import { useState } from 'react';
import DisplayToken from '../../../components/DisplayToken';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tokens = [
  {
    name: 'Erg',
    id: '6b2eae7e6506add0bd1d6add8f30841086b2eae7ee2c25f71cb2368ae7ef',
  },
  {
    name: 'eRSN',
    id: '7eeae76b2eae7ef2c25f71cb2368ef6506add0830841bd1d6add086b2eae',
  },
  {
    name: 'ergold',
    id: 'ae7ef2eae7eeae7ef2c25f716506abd1d6add086b2ecb236830841dd086b',
  },
];

export default function BurnToken() {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedTokens>) => {
    const {
      target: { value },
    } = event;
    setSelectedTokens(typeof value === 'string' ? value.split(',') : value);
  };

  const handleBurn = () => {
    console.log('burn', selectedTokens);
  };

  return (
    <AppFrame
      title="Burn Token"
      navigation={<BackButton />}
      toolbar={
        <Button onClick={handleBurn} disabled={selectedTokens.length == 0}>
          Burn {selectedTokens.length} Token
          {selectedTokens.length > 1 ? 's' : ''}
        </Button>
      }
    >
      <FormControl>
        <InputLabel id="tokens-multiple-checkbox-label">Tokens</InputLabel>
        <Select
          labelId="tokens-multiple-checkbox-label"
          id="tokens-multiple-checkbox"
          multiple
          value={selectedTokens}
          onChange={handleChange}
          renderValue={(selected) =>
            tokens
              .filter((item) => selected.includes(item.id))
              .map((item) => item.name)
              .join(', ')
          }
          MenuProps={MenuProps}
        >
          {tokens.map((token) => (
            <MenuItem key={token.id} value={token.id}>
              <Checkbox checked={selectedTokens.includes(token.id)} />
              <DisplayToken
                {...token}
                displayAmount={false}
                style={{ width: 'calc(100% - 44px)' }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </AppFrame>
  );
}
