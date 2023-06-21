import React from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';

interface PropsType extends TypographyProps {
  id: string | undefined;
  paddingSize?: number;
  prefix?: any;
}

export default function ({
  id = '',
  paddingSize = 6,
  prefix,
  sx,
  ...restProps
}: PropsType) {
  const cutIndex = id.length - paddingSize;
  const idStart = id.substring(0, cutIndex);
  const idEnd = id.substring(cutIndex);
  return (
    <Box display="flex" sx={sx}>
      {prefix}
      <Typography noWrap {...restProps} sx={{ flexGrow: 0 }}>
        {idStart}
      </Typography>
      <Typography noWrap {...restProps} sx={{ flexShrink: 0 }}>
        {idEnd}
      </Typography>
    </Box>
  );
}
