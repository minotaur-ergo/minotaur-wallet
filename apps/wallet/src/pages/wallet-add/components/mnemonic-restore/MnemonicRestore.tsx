import { useEffect, useState } from 'react';

import {
  Alert,
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { getDefaultWordlist, wordlists } from 'bip39';

import useMnemonicValid from '@/hooks/useMnemonicValid';

import MnemonicPassphrase from '../mnemonic-passphrase/MnemonicPassphrase';
import MnemonicView from '../mnemonic-view/MnemonicView';

const words = wordlists[getDefaultWordlist()];

interface MnemonicRestorePropsType {
  mnemonic: string;
  mnemonicPassphrase: string;
  networkType: string;
  setHasError: (hasError: boolean) => unknown;
  setMnemonic: (mnemonic: string) => unknown;
  setMnemonicPassphrase: (mnemonicPassphrase: string) => unknown;
  setReadOnlyWalletId: (id: number) => unknown;
}

export const MnemonicRestore = (props: MnemonicRestorePropsType) => {
  const [selected, setSelected] = useState('');
  const [extended, setExtended] = useState(props.mnemonicPassphrase !== '');
  const [convert, setConvert] = useState(false);
  const mnemonicWords = props.mnemonic.split(' ');

  const validate = useMnemonicValid(
    props.mnemonic,
    props.mnemonicPassphrase,
    props.networkType,
  );

  const selectElement = (element: string) => {
    if (words.indexOf(element) !== -1) {
      props.setMnemonic(
        (props.mnemonic ? props.mnemonic + ' ' + element : element).trim(),
      );
      setSelected('');
    }
  };

  const selectElements = (elements: string[]) => {
    const valids: string[] = [];
    const invalidIndex: number = elements.findIndex((w: string) => {
      const found = words.includes(w);
      if (found) valids.push(w);
      return !found;
    });
    props.setMnemonic(
      (props.mnemonic
        ? props.mnemonic + ' ' + valids.join(' ')
        : valids.join(' ')
      ).trim(),
    );
    if (invalidIndex !== -1) {
      setSelected(elements.slice(invalidIndex).join(' '));
    } else {
      setSelected('');
    }
  };

  const handleRemoveElement = (index: number) => {
    const mnemonicParts = props.mnemonic.split(' ');
    mnemonicParts.splice(index, 1);
    props.setMnemonic(mnemonicParts.join(' '));
  };

  const filteredWords = words.filter((item) => item.indexOf(selected) === 0);
  useEffect(() => {
    if (validate.valid && (!validate.exists || convert)) {
      props.setHasError(extended && props.mnemonicPassphrase === '');
    } else {
      props.setHasError(true);
    }
  });

  useEffect(() => {
    props.setReadOnlyWalletId(validate.readOnlyWalletId ?? -1);
  }, [validate, props]);

  return (
    <Box>
      <Typography>
        Enter your mnemonic words below. Mnemonic must contain 12, 15, 18, 21,
        or 24 words
      </Typography>
      <MnemonicView
        mnemonic={props.mnemonic}
        handleClick={handleRemoveElement}
      />
      {mnemonicWords.length < 24 ? (
        <Autocomplete
          // size='small'
          autoHighlight={true}
          // autoSelect={true}
          value={null}
          inputValue={selected}
          onInputChange={(_e, value) => setSelected(value)}
          options={filteredWords.map((item) => ({ title: item }))}
          getOptionLabel={(option) => option.title}
          onChange={(_event, value) => {
            if (value) {
              selectElement(value.title);
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            selectElements(
              event.clipboardData.getData('text').trim().split(/\s+/),
            );
          }}
          limitTags={10}
          renderInput={(params) => (
            <>
              <FormControl fullWidth variant="outlined">
                <TextField
                  {...params}
                  variant="outlined"
                  label="Type mnemonic word"
                  placeholder="Favorites"
                  value={selected}
                  onChange={({ target }) => {
                    setSelected(target.value);
                    const values = target.value.trim().split(/\s+/);
                    if (values.length > 1) {
                      selectElements(values);
                    }
                  }}
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                      selectElement(selected);
                    }
                  }}
                />
              </FormControl>
              {validate.remainingWordCount > 0 ? (
                <FormHelperText error id="accountId-error">
                  {validate.remainingWordCount} word
                  {validate.remainingWordCount > 1 ? 's' : ''} remaining
                </FormHelperText>
              ) : null}
            </>
          )}
        />
      ) : null}
      <MnemonicPassphrase
        setPassword={props.setMnemonicPassphrase}
        setError={props.setHasError}
        password={props.mnemonicPassphrase}
        extended={extended}
        setExtended={setExtended}
      />
      {validate.exists ? (
        <Alert severity="info" icon={' '} sx={{ my: 2 }}>
          <Typography>
            A readonly wallet with this mnemonic and pass phrase already exists.
            The read only wallet name is <b>{validate.name}</b>
          </Typography>
          <FormControlLabel
            control={
              <Switch value={convert} onChange={() => setConvert(!convert)} />
            }
            label="Convert it to a normal wallet"
          />
        </Alert>
      ) : undefined}
    </Box>
  );
};
