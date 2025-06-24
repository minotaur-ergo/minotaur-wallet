import { useContext, useEffect, useState } from 'react';

import { StateWallet, TokenBalanceBigInt } from '@minotaur-ergo/types';
import { SelectChangeEvent } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { AssetDbAction } from '@/action/db';
import AssetRow from '@/components/asset-row/AssetRow';
import txGenerateContext from '@/components/sign/context/TxGenerateContext';
import Asset from '@/db/entities/Asset';

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

interface TokenSelectPropsType {
  index: number;
  wallet: StateWallet;
}

const TokenSelect = (props: TokenSelectPropsType) => {
  const generatorContext = useContext(txGenerateContext);
  const content = generatorContext.receivers[props.index];
  const [selected, setSelected] = useState<Array<string>>([]);
  const [tokens, setTokens] = useState<Array<Asset>>([]);
  useEffect(() => {
    if (tokens.length === 0) {
      AssetDbAction.getInstance()
        .getAllAsset(props.wallet.networkType)
        .then((res) => {
          if (res && res.length > tokens.length) {
            setTokens(res ? res : []);
          }
        });
    }
  });

  const getTokenName = (tokenId: string) => {
    const filtered = tokens.filter((item) => item.asset_id === tokenId);
    if (filtered.length) {
      return filtered[0].name;
    }
    return tokenId.substring(0, 5) + '...';
  };
  const handleSelectToken = (event: SelectChangeEvent<Array<string>>) => {
    const value = event.target.value;
    const selected = typeof value === 'string' ? value.split(',') : value;
    const newTokens: Array<TokenBalanceBigInt> = content.tokens.filter((item) =>
      selected.includes(item.tokenId),
    );
    const oldSelectedIds = newTokens.map((item) => item.tokenId);
    selected
      .filter((item) => !oldSelectedIds.includes(item))
      .forEach((item) => newTokens.push({ tokenId: item, balance: 0n }));
    generatorContext.edit(props.index, { tokens: newTokens });
  };

  useEffect(() => {
    const sorted = content.tokens.map((item) => item.tokenId).sort();
    if (JSON.stringify(sorted) !== JSON.stringify(selected)) {
      setSelected(sorted);
    }
  }, [content.tokens, selected]);
  if (Object.keys(generatorContext.tokens).length === 0) return null;
  return (
    <FormControl>
      <InputLabel id="demo-multiple-checkbox-label">Tokens</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={selected}
        onChange={handleSelectToken}
        renderValue={(selected) =>
          selected.map((item) => getTokenName(item)).join(', ')
        }
        MenuProps={MenuProps}
      >
        {Object.keys(generatorContext.tokens).map((tokenId) => (
          <MenuItem key={tokenId} value={tokenId}>
            <Checkbox checked={selected.indexOf(tokenId) > -1} />
            <AssetRow
              id={tokenId}
              networkType={props.wallet.networkType}
              amount={''}
              width="calc(100% - 42px)"
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TokenSelect;
