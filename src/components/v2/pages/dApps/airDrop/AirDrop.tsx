import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AppFrame from '../../../layouts/AppFrame';
import BackButton from '../../../components/BackButton';
import { useMemo, useState } from 'react';
import { ContentPasteRounded } from '@mui/icons-material';
import DisplayToken from '../../../components/DisplayToken';
import { SelectableType, TokenType } from '../../../models';
import AllAmountButton from '../../../components/AllAmountButton';

type TokenFieldType = TokenType &
  SelectableType & {
    available: number;
  };

export default function AirDrop() {
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [tokens, setTokens] = useState<TokenFieldType[]>([
    {
      id: '1506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
      name: 'Token 1',
      available: 25,
    },
    {
      id: '25061d6add0ae7ef2c25f71cb2368308add086b2ebdeae7eeae7ef4186b2',
      name: 'Token 2',
      available: 142,
    },
    {
      id: '6e7ef2c25f2eae7eeae7efb506add086b2ea23683084171c6add086bbd1d',
      name: 'Token 3',
      available: 37.6,
    },
  ] as TokenFieldType[]);

  const selectedTokens = useMemo(
    () => tokens.filter((item) => item.selected),
    [tokens]
  );

  const setTokenAmount = (id: string, amount: number) => {
    setTokens((prevState) => {
      const newState = [...prevState];
      const index = newState.findIndex((item) => item.id === id);
      newState[index].amount = amount;
      return newState;
    });
  };

  const handleSelectToken = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setTokens((prevState) => {
      const newState = [...prevState];
      newState.forEach((token) => {
        token.selected = value.includes(token.id);
      });
      return newState;
    });
  };

  const handleSubmit = () => {
    console.log({ selectedTokens });
  };

  return (
    <AppFrame
      title="Air Drop"
      navigation={<BackButton />}
      toolbar={<Button onClick={handleSubmit}>Send</Button>}
    >
      <Stack spacing={2}>
        <TextField
          label="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          multiline
          minRows={3}
          maxRows={10}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <ContentPasteRounded />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography>ERG</Typography>
              </InputAdornment>
            ),
          }}
          helperText={<AllAmountButton amount={1420} />}
        />
        <FormControl>
          <InputLabel id="tokens-multiple-checkbox-label">Tokens</InputLabel>
          <Select
            labelId="tokens-multiple-checkbox-label"
            id="tokens-multiple-checkbox"
            multiple
            value={selectedTokens.map((item) => item.id)}
            onChange={handleSelectToken}
            renderValue={(selected) =>
              tokens
                .filter((item) => selected.includes(item.id))
                .map((item) => item.name)
                .join(', ')
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: '70vh',
                },
              },
            }}
          >
            {tokens.map((token) => (
              <MenuItem key={token.id} value={token.id}>
                <Checkbox checked={token.selected} />
                <DisplayToken
                  {...token}
                  displayAmount={false}
                  style={{ width: 'calc(100% - 42px)' }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedTokens.map((token) => (
          <TextField
            key={token.id}
            label={token.name}
            value={token.amount}
            onChange={(event) =>
              setTokenAmount(token.id, Number(event.target.value))
            }
            helperText={
              <AllAmountButton
                amount={token.available}
                onClick={(amount) => setTokenAmount(token.id, amount)}
              />
            }
          />
        ))}
      </Stack>
    </AppFrame>
  );
}
