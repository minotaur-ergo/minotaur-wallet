import AssetRow from '@/components/asset-row/AssetRow';
import { ChainTypeInterface } from '@/utils/networks/interfaces';
import Checkbox from '@mui/material/Checkbox';
import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { AssetInfo, TokenAmount } from '@/types/dapps';

interface SelectTokensPropsType {
  amounts: TokenAmount;
  setAmounts: React.Dispatch<React.SetStateAction<TokenAmount>>;
  tokenIds: Array<string>;
  setTokenIds: React.Dispatch<React.SetStateAction<Array<string>>>;
  getAssets: () => Promise<Array<AssetInfo>>;
  chain: ChainTypeInterface;
}

const SelectTokens = (props: SelectTokensPropsType) => {
  const [name, setName] = useState('');
  const [tokens, setTokens] = useState<Array<AssetInfo>>([]);
  const [loaded, setLoaded] = useState(false);
  const selectToken = (event: SelectChangeEvent<Array<string>>) => {
    const value = event.target.value;
    const keys = typeof value === 'string' ? value.split(',') : value;
    const newAmounts: TokenAmount = {};
    keys.forEach((key) => {
      newAmounts[key] = props.amounts[key] ?? { amount: 0n, total: 0n };
    });
    const searchKey = keys.length === 1 ? keys[0] : undefined;
    const foundToken = tokens.filter((token) => token.id === searchKey);
    const name =
      foundToken.length > 0
        ? foundToken[0].name
        : searchKey
          ? searchKey.substring(0, 5) + '...'
          : null;
    tokens.forEach((token) => {
      if (keys.includes(token.id)) {
        newAmounts[token.id].total = token.amount;
      }
    });
    setName(name ? name : keys.length > 1 ? 'Multiple Tokens' : '');
    props.setTokenIds(keys);
    props.setAmounts(newAmounts);
  };
  useEffect(() => {
    if (!loaded) {
      props.getAssets().then((tokens) => {
        setLoaded(true);
        setTokens(tokens);
      });
    }
  });
  return (
    <FormControl>
      <InputLabel id="selected-token-to-burn">Token</InputLabel>
      <Select
        value={props.tokenIds}
        label="Token"
        multiple
        onChange={selectToken}
        renderValue={() => `${name}`}
        labelId="selected-token-to-burn"
      >
        {tokens.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            <Checkbox checked={props.tokenIds.includes(item.id)} />
            <AssetRow
              id={item.id}
              amount=""
              networkType={props.chain.label}
              width={'calc(100% - 44px)'}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectTokens;
