import React, { ReactElement, useMemo } from 'react';

import { Box, Typography } from '@mui/material';

interface DisplayPropertyPropsType {
  label: string;
  value: string | number | null | React.ReactNode;
  endAdornment?: ReactElement;
}

const DisplayProperty: React.FC<DisplayPropertyPropsType> = ({
  label,
  value,
  endAdornment,
}) => {
  const _value = useMemo(() => {
    if (value === null) return '-';
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  }, [value]);

  return (
    <Box>
      <Box display="flex" alignItems="end">
        <Box flexGrow={1} sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" color="textSecondary">
            {label}
          </Typography>
          <Typography noWrap sx={{ overflow: 'hidden' }}>
            {_value}
          </Typography>
        </Box>
        {endAdornment && <Box>{endAdornment}</Box>}
      </Box>
    </Box>
  );
};

export default DisplayProperty;
