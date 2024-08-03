import { Typography } from '@mui/material';
import React from 'react';
import ConsolidateIndicator from './ConsolidateIndicator';

interface OldestBoxAgePropsType {
  age: number;
  consolidate: boolean;
}

const OldestBoxAge = (props: OldestBoxAgePropsType) => {
  return (
    <React.Fragment>
      <Typography variant="body2" color="textSecondary">
        Age of oldest box
      </Typography>
      <Typography mb={1}>
        <Typography component="span" fontSize="large">
          {props.age.toFixed(2)}
        </Typography>{' '}
        years
      </Typography>
      <ConsolidateIndicator consolidate={props.consolidate} />
      <Typography variant="body2" color="textSecondary" pl={4} mb={3}>
        Storage rent will be applied on boxes older than 4 years.
      </Typography>
    </React.Fragment>
  );
};

export default OldestBoxAge;
