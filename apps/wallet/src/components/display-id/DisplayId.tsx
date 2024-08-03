import React from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';
import { dottedText } from '@/utils/functions';
import useAddressName from '@/hooks/useAddressName';

interface DisplayIdPropsType extends TypographyProps {
  id: string | undefined;
  showAddress?: boolean;
  paddingSize?: number;
  prefixDisplay?: React.ReactNode | null;
  customAddresses?: Array<{ name: string; address: string }>;
}

const DisplayId = ({
  id = '',
  paddingSize = 10,
  sx,
  showAddress = false,
  prefixDisplay = null,
  customAddresses = [],
  ...restProps
}: DisplayIdPropsType) => {
  const name = useAddressName(showAddress ? id : '', customAddresses);
  const dotted = dottedText(id, name !== '' ? 4 : paddingSize);
  return (
    <Box display="flex" sx={sx}>
      {prefixDisplay}
      <Typography noWrap {...restProps} sx={{ flexGrow: 0 }}>
        {name ? `${name} (${dotted})` : dotted}
      </Typography>
    </Box>
  );
};

export default DisplayId;
