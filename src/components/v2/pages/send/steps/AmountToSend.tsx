import { useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddIcon from '@mui/icons-material/Add';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { BookOutlined } from '@mui/icons-material';
import useDrawer from '../../../reducers/useDrawer';
import AddressBookModal from '../../../components/AddressBookModal';

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

interface TokenType {
  id: string;
  name: string;
  available: number;
}
interface ReceiverTokenType {
  id: string;
  amount: number;
}
interface ReceiverType {
  address: string;
  amount: number | null;
  tokens: ReceiverTokenType[];
}
interface ReceiverFormPropsType {
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number, newValue: ReceiverType) => void;
  receiver: ReceiverType;
  tokens: TokenType[];
}

const ReceiverForm = ({
  index,
  onRemove,
  onEdit,
  receiver,
  tokens,
}: ReceiverFormPropsType) => {
  const [handleOpenAddressBook, addressBookProps] = useDrawer();
  const receiverTokensId = receiver.tokens.map(({ id }) => id);
  const handle_select_token = (
    event: SelectChangeEvent<typeof receiverTokensId>
  ) => {
    const {
      target: { value },
    } = event;
    const selected = typeof value === 'string' ? value.split(',') : value;
    const tokens = selected.map((id) => ({
      id,
      amount: receiver.tokens.find((item) => item.id === id)?.amount,
    }));
    onEdit(index, Object.assign({}, receiver, { tokens }));
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ px: 1, display: 'flex' }}>
        <Typography sx={{ flexGrow: 1 }}>Receiver {index + 1}</Typography>
        {index > 0 && (
          <Button
            variant="text"
            fullWidth={false}
            sx={{ p: 0 }}
            onClick={() => onRemove(index)}
          >
            Remove
          </Button>
        )}
      </Box>
      <TextField
        label="Receiver Address"
        value={receiver.address}
        onChange={(event) =>
          onEdit(
            index,
            Object.assign({}, receiver, { address: event.target.value })
          )
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOpenAddressBook}>
                <BookOutlined />
              </IconButton>
              <IconButton>
                <QrCodeScannerIcon />
              </IconButton>
              <IconButton edge="end">
                <ContentPasteRoundedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <AddressBookModal
        {...addressBookProps}
        address={receiver.address}
        onChange={(item) =>
          onEdit(index, Object.assign({}, receiver, { address: item.address }))
        }
      />
      <TextField
        label="Amount"
        value={receiver.amount}
        onChange={(event) =>
          onEdit(
            index,
            Object.assign({}, receiver, { amount: event.target.value })
          )
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography>ERG</Typography>
            </InputAdornment>
          ),
        }}
        helperText={
          <Button
            variant="text"
            fullWidth={false}
            sx={{ p: 0, minWidth: 'unset', color: 'info.dark' }}
          >
            38 available
          </Button>
        }
      />
      <FormControl>
        <InputLabel id="demo-multiple-checkbox-label">Tokens</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={receiverTokensId}
          onChange={handle_select_token}
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
              <Checkbox
                checked={
                  receiver.tokens.findIndex((item) => item.id === token.id) > -1
                }
              />
              <ListItemText primary={token.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {receiver.tokens.map((token, ind) => (
        <TextField
          key={ind}
          label={tokens.find((item) => item.id === token.id)?.name}
          value={token.amount}
          onChange={(event) => {
            const newTokens = [...receiver.tokens];
            newTokens[ind] = Object.assign({}, newTokens[ind], {
              amount: event.target.value,
            });
            onEdit(index, Object.assign({}, receiver, { tokens: newTokens }));
          }}
          helperText={
            <Button
              variant="text"
              fullWidth={false}
              sx={{ p: 0, minWidth: 'unset', color: 'info.dark' }}
            >
              124 available
            </Button>
          }
        />
      ))}
    </Stack>
  );
};

const newReceiver = { address: '', amount: null, tokens: [] };

export default function () {
  const [age, setAge] = useState('');
  const [tokens, set_tokens] = useState([
    { id: '01', name: 'Token 1', available: 25 },
    { id: '02', name: 'Token 2', available: 142 },
    { id: '03', name: 'Token 3', available: 37.6 },
  ]);
  const [receivers, set_receivers] = useState<ReceiverType[]>([newReceiver]);

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const handle_add = () =>
    set_receivers((prevState) => [...prevState, newReceiver]);
  const handle_remove = (index: number) =>
    set_receivers((prevState) => prevState.filter((_, i) => i != index));
  const handle_edit = (index: number, newValue: ReceiverType) =>
    set_receivers((prevState) => {
      const newState = [...prevState];
      newState[index] = newValue;
      return newState;
    });

  return (
    <Box>
      <FormControl>
        <InputLabel id="demo-simple-select-label">From Address</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value={10}>All Addresses</MenuItem>
          <MenuItem value={20}>Main Address</MenuItem>
          <MenuItem value={30}>Secondary Address</MenuItem>
        </Select>
        <FormHelperText sx={{ fontSize: '1rem' }}>
          {(38).toFixed(2)} available
        </FormHelperText>
      </FormControl>

      <Stack spacing={3} sx={{ mb: 3, mt: 2 }}>
        {receivers.map((receiver, index) => (
          <ReceiverForm
            key={index}
            index={index}
            onEdit={handle_edit}
            onRemove={handle_remove}
            receiver={receiver}
            tokens={tokens}
          />
        ))}
      </Stack>

      <Button variant="outlined" onClick={handle_add} startIcon={<AddIcon />}>
        Add more receiver
      </Button>
    </Box>
  );
}
