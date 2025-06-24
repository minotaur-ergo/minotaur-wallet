import { useEffect, useState } from 'react';

import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { getDefaultWordlist, mnemonicToSeedSync, wordlists } from 'bip39';

import MnemonicPassphrase from '../mnemonic-passphrase/MnemonicPassphrase';
import MnemonicView from '../mnemonic-view/MnemonicView';

const words = wordlists[getDefaultWordlist()];

interface MnemonicRestorePropsType {
  mnemonic: string;
  mnemonicPassphrase: string;
  setHasError: (hasError: boolean) => unknown;
  setMnemonic: (mnemonic: string) => unknown;
  setMnemonicPassphrase: (mnemonicPassphrase: string) => unknown;
}

export const MnemonicRestore = (props: MnemonicRestorePropsType) => {
  const [selected, setSelected] = useState('');
  const [extended, setExtended] = useState(false);
  const mnemonicWords = props.mnemonic.split(' ');

  const selectElement = (element: string) => {
    if (words.indexOf(element) !== -1) {
      props.setMnemonic(
        (props.mnemonic ? props.mnemonic + ' ' + element : element).trim(),
      );
      setSelected('');
    }
  };
  const handleRemoveElement = (index: number) => {
    const mnemonicParts = props.mnemonic.split(' ');
    mnemonicParts.splice(index, 1);
    props.setMnemonic(mnemonicParts.join(' '));
  };
  const filteredWords = words.filter((item) => item.indexOf(selected) === 0);
  const requiredWordCount =
    Math.max(4, Math.ceil(mnemonicWords.length / 3)) * 3;
  useEffect(() => {
    if (mnemonicWords.length === requiredWordCount) {
      try {
        mnemonicToSeedSync(props.mnemonic);
        props.setHasError(extended && props.mnemonicPassphrase === '');
        return;
      } catch (e) {
        console.log(e);
      }
    }
    props.setHasError(true);
  });
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
          autoSelect={true}
          value={selected === '' ? null : { title: selected }}
          inputValue={selected}
          options={filteredWords.map((item) => ({ title: item }))}
          getOptionLabel={(option) => option.title}
          onChange={(_event, value) => {
            if (value) {
              selectElement(value.title);
            }
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
                  }}
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                      selectElement(selected);
                    }
                  }}
                />
              </FormControl>
              {requiredWordCount > mnemonicWords.length ? (
                <FormHelperText error id="accountId-error">
                  {requiredWordCount -
                    (props.mnemonic === '' ? 0 : mnemonicWords.length)}{' '}
                  words remaining
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
    </Box>
  );
};
