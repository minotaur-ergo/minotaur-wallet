import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { DAppPropsType } from '@/types/dapps';
import React, { useState } from 'react';
import DisplayId from '@/components/display-id/DisplayId';
import useAddresses from './useAddresses';
import useAddressBoxes from './useAddressBoxes';
import UnspentBoxesCount from './UnspentBoxesCount';
import OldestBoxAge from './OldestBoxAge';
import getColor from './getColor';

const BoxConsolidation = (props: DAppPropsType) => {
  const addresses = useAddresses(props);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const state = useAddressBoxes(addresses, selectedAddress, props);
  const handleChangeAddress = (event: SelectChangeEvent) => {
    const index = parseInt(event.target.value);
    if (!isNaN(index) && index >= 0 && index < addresses.length) {
      setSelectedAddress(index);
    }
  };
  const boxCountConsolidate = state.boxesCount >= 100;
  const ageConsolidate = state.oldestAge >= 3.0;
  const consolidate = boxCountConsolidate || ageConsolidate;
  return (
    <React.Fragment>
      <FormControl sx={{ mb: 2 }}>
        <InputLabel>Address</InputLabel>
        <Select
          value={selectedAddress.toString()}
          onChange={handleChangeAddress}
        >
          {addresses.map((item, index) => (
            <MenuItem key={item} value={index.toString()}>
              <DisplayId id={item} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {state.boxesCount === 0 ? (
        <Typography>There is no boxes in this address</Typography>
      ) : (
        <React.Fragment>
          <UnspentBoxesCount
            consolidate={boxCountConsolidate}
            boxCount={state.boxesCount}
          />
          <OldestBoxAge age={state.oldestAge} consolidate={ageConsolidate} />
          <Divider />

          <Typography
            textAlign="center"
            fontSize="x-large"
            color={getColor(consolidate)}
            mt={3}
            mb={2}
          >
            {consolidate ? 'Consider consolidation' : 'You are fine!'}
          </Typography>
          <Typography
            textAlign="center"
            variant="body2"
            color="textSecondary"
            mb={3}
          >
            You can renew {state.boxesCount} box
            {state.boxesCount > 1 ? 'es' : ''}{' '}
            {consolidate ? '' : ', but it is not necessary.'}
          </Typography>
          <Button>
            Renew {state.boxesCount} box{state.boxesCount > 1 ? 'es' : ''}
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default BoxConsolidation;
