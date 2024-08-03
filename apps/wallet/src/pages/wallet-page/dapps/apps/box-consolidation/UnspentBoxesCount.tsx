import { Typography } from '@mui/material';
import React from 'react';
import ConsolidateIndicator from './ConsolidateIndicator';

interface UnspentBoxesCountPropsType {
  boxCount: number;
  consolidate: boolean;
}
const UnspentBoxesCount = (props: UnspentBoxesCountPropsType) => {
  return (
    <React.Fragment>
      <Typography variant="body2" color="textSecondary">
        Number of unspent boxes
      </Typography>
      <Typography mb={1}>
        <Typography component="span" fontSize="large">
          {props.boxCount}
        </Typography>{' '}
        boxes
      </Typography>
      <ConsolidateIndicator consolidate={props.consolidate} />
      <Typography variant="body2" color="textSecondary" pl={4} mb={3}>
        The number of boxes more than 100 slows down the wallet.
      </Typography>
    </React.Fragment>
  );
};

export default UnspentBoxesCount;
