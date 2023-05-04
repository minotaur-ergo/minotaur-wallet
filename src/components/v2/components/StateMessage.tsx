import React, { ReactElement } from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';

interface PropsType {
  title: string;
  description?: string;
  icon?: ReactElement | false;
  color?: TypographyProps['color'];
  disableIconShadow?: boolean;
}

export default function ({
  title,
  description,
  icon,
  disableIconShadow = false,
  color = 'info.dark',
}: PropsType) {
  return (
    <Box>
      {icon && (
        <Box sx={{ textAlign: 'center', mb: 3, color: color }}>
          {icon}
          {!disableIconShadow && (
            <Box
              sx={{
                width: '100px',
                height: '16px',
                borderRadius: '50%',
                bgcolor: color,
                mx: 'auto',
                opacity: 0.1,
              }}
            />
          )}
        </Box>
      )}
      <Typography variant="h2" color={color} textAlign="center">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="textSecondary" textAlign="center">
          {description}
        </Typography>
      )}
    </Box>
  );
}
