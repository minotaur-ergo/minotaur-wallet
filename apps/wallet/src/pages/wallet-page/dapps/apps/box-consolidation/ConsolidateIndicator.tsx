import React from 'react';

import { CheckCircleOutline, WarningAmberRounded } from '@mui/icons-material';
import { Typography } from '@mui/material';

import getColor from './getColor';

interface ConsolidateIndicatorPropsType {
  consolidate: boolean;
}
const ConsolidateIndicator = (props: ConsolidateIndicatorPropsType) => {
  return (
    <React.Fragment>
      <Typography
        color={getColor(props.consolidate)}
        fontWeight={500}
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        {props.consolidate ? <WarningAmberRounded /> : <CheckCircleOutline />}
        {props.consolidate ? 'Consider consolidation' : "It's fine"}
      </Typography>
    </React.Fragment>
  );
};

export default ConsolidateIndicator;
