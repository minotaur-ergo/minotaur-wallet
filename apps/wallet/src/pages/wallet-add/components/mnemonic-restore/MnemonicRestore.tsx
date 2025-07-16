import { useEffect, useState } from 'react';

import { WalletType } from '@minotaur-ergo/types';
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { getDefaultWordlist, mnemonicToSeedSync, wordlists } from 'bip39';
import bs58check from 'bs58check';

import { RootPathWithoutIndex } from '@/action/address';
import { WalletDbAction } from '@/action/db';
import Wallet from '@/db/entities/Wallet';
import { bip32 } from '@/utils/functions';

import MnemonicPassphrase from '../mnemonic-passphrase/MnemonicPassphrase';
import MnemonicView from '../mnemonic-view/MnemonicView';

const words = wordlists[getDefaultWordlist()];

interface MnemonicRestorePropsType {
  mnemonic: string;
  mnemonicPassphrase: string;
  setHasError: (hasError: boolean) => unknown;
  setMnemonic: (mnemonic: string) => unknown;
  setMnemonicPassphrase: (mnemonicPassphrase: string) => unknown;
  setReadonlyWalletFound: (wallet: Wallet | null) => void;
  setConvertReadonly: (convert: boolean) => void;
}

export const MnemonicRestore = (props: MnemonicRestorePropsType) => {
  const [selected, setSelected] = useState('');
  const [extended, setExtended] = useState(false);
  const mnemonicWords = props.mnemonic.split(' ');
  const [readonlyWalletFound, setReadonlyWalletFound] = useState<Wallet | null>(
    null,
  );
  const [convertReadonly, setConvertReadonly] = useState(false);

  const validWordCounts = [12, 15, 18, 21, 24];
  const isMnemonicValid = validWordCounts.includes(mnemonicWords.length);

  function areXpubsEqual(xpubA: string, xpubB: string): boolean {
    try {
      const bytesA = bs58check.decode(xpubA).slice(13, 78);
      const bytesB = bs58check.decode(xpubB).slice(13, 78);
      if (bytesA.length !== bytesB.length) return false;
      for (let i = 0; i < bytesA.length; i++) {
        if (bytesA[i] !== bytesB[i]) return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    const checkReadonlyWallet = async () => {
      if (!isMnemonicValid) {
        setReadonlyWalletFound(null);
        return;
      }
      try {
        const seed = mnemonicToSeedSync(
          props.mnemonic,
          props.mnemonicPassphrase || '',
        );
        const master = bip32.fromSeed(seed);
        const derivedXpub = master
          .derivePath(RootPathWithoutIndex)
          .neutered()
          .toBase58();
        console.log('Derived xpub:', derivedXpub);

        console.log(
          'Derived xpub (hex):',
          bs58check.decode(derivedXpub).toString('hex'),
        );

        const wallets = await WalletDbAction.getInstance().getWallets();
        console.log('Wallets from DB:', wallets);

        const readonlyWallets = wallets.filter(
          (wallet: Wallet) => wallet.type === WalletType.ReadOnly,
        );

        const matchingReadOnlyWallet = readonlyWallets.find((wallet: Wallet) =>
          areXpubsEqual(derivedXpub, wallet.extended_public_key),
        );
        console.log('Matching readonly wallet:', matchingReadOnlyWallet);

        setReadonlyWalletFound(matchingReadOnlyWallet || null);
        console.log('Comparing xpubs:');
      } catch (e) {
        console.log('Error in checkReadonlyWallet:', e);
        setReadonlyWalletFound(null);
      }
    };
    checkReadonlyWallet();
  }, [isMnemonicValid, props.mnemonic, props.mnemonicPassphrase]);

  useEffect(() => {
    setReadonlyWalletFound(readonlyWalletFound);
  }, [readonlyWalletFound]);

  useEffect(() => {
    setConvertReadonly(convertReadonly);
  }, [convertReadonly]);

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

  console.log('RootPathWithoutIndex:', RootPathWithoutIndex);
  console.log('Mnemonic:', props.mnemonic);
  console.log('Passphrase:', props.mnemonicPassphrase);

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
      {readonlyWalletFound && (
        <FormControlLabel
          control={
            <Switch
              checked={convertReadonly}
              onChange={(e) => setConvertReadonly(e.target.checked)}
            />
          }
          label={`There was a readonly wallet "${readonlyWalletFound.name}" created before. Do you want to convert it to a normal wallet?`}
        />
      )}
    </Box>
  );
};
