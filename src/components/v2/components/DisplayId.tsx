import { ElementType, ReactElement } from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';

interface PropsType extends TypographyProps {
  id: string | undefined;
  label?: string;
  paddingSize?: number;
  prefix?: any;
  endAdornment?: ReactElement;
  component?: ElementType<any>;
}

export default function ({
  id = '',
  label,
  paddingSize = 6,
  prefix,
  sx,
  endAdornment,
  component,
  ...restProps
}: PropsType) {
  const cutIndex = id.length - paddingSize;
  const idStart = id.substring(0, cutIndex);
  const idEnd = id.substring(cutIndex);

  const IdBox = (
    <Box display="flex" sx={sx} component={component}>
      {prefix}
      <Typography noWrap {...restProps} sx={{ flexGrow: 0 }}>
        {idStart}
      </Typography>
      <Typography noWrap {...restProps} sx={{ flexShrink: 0 }}>
        {idEnd}
      </Typography>
      {endAdornment && <Box>{endAdornment}</Box>}
    </Box>
  );

  if (label)
    return (
      <Box>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
        {IdBox}
      </Box>
    );
  return IdBox;
}
