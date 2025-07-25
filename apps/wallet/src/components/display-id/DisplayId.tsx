import React from 'react';

import { dottedText } from '@minotaur-ergo/utils';
import { Box, Typography, TypographyProps } from '@mui/material';

import useAddressName from '@/hooks/useAddressName';

interface DisplayIdPropsType extends TypographyProps {
  id: string | undefined;
  showAddress?: boolean;
  paddingSize?: number;
  prefixDisplay?: React.ReactNode | null;
  customAddresses?: Array<{ name: string; address: string }>;
  endAdornment?: React.ReactElement;
}

const DisplayId = ({
  id = '',
  paddingSize = 10,
  sx,
  showAddress = false,
  prefixDisplay = null,
  customAddresses = [],
  endAdornment = undefined,
  ...restProps
}: DisplayIdPropsType) => {
  const name = useAddressName(showAddress ? id : '', customAddresses);
  const dotted = dottedText(id, name !== '' ? 4 : paddingSize);
  return (
    <Box display="flex" sx={sx}>
      {prefixDisplay}
      <Typography noWrap {...restProps} sx={{ flexGrow: 1 }}>
        {name ? `${name} (${dotted})` : dotted}
      </Typography>
      {endAdornment && <Box>{endAdornment}</Box>}
    </Box>
  );
};

export default DisplayId;
