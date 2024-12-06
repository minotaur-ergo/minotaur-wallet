import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { tokenStr } from '@/utils/functions';
import DisplayId from '@/components/display-id/DisplayId';
import { AssetDbAction } from '@/action/db';

interface AddressTokenPropsType {
  id: string;
  network_type: string;
  amount: bigint;
}

const AddressToken = (props: AddressTokenPropsType) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [decimal, setDecimal] = useState(0);
  const [loadedId, setLoadedId] = useState('');
  useEffect(() => {
    if (!loading) {
      if (loadedId !== props.id) {
        const loadingId = props.id;
        AssetDbAction.getInstance()
          .getAssetByAssetId(props.id, props.network_type)
          .then((result) => {
            if (result) {
              setDecimal(result.decimal ? result.decimal : 0);
              setName(result.name ? result.name : '');
            }
            setLoading(false);
            setLoadedId(loadingId);
          });
      }
    }
  });
  return (
    <Box display="flex">
      <Box sx={{ flexGrow: 1 }}>
        {name ? name : <DisplayId id={props.id} />}
      </Box>
      <Typography>{tokenStr(props.amount, decimal)}</Typography>
    </Box>
  );
};

export default AddressToken;
