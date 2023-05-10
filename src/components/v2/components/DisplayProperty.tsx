import React, { ReactElement, useMemo } from 'react';
import { Box, Typography } from '@mui/material';

interface PropsType {
  label: string;
  value: string | number | null;
  endAdornment?: ReactElement;
}

export default function ({ label, value, endAdornment }: PropsType) {
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
}
