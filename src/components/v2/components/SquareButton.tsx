import { Box, BoxProps, ButtonBase, styled, Typography } from '@mui/material';
import { ReactElement } from 'react';

const StyledSquareButton = styled(ButtonBase)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  '& .icon-container': {
    borderRadius: theme.shape.borderRadius / 2,
    padding: theme.spacing(2),
    opacity: 0.75,
    '& svg': {
      color: theme.palette.common.white,
    },
  },
}));

interface PropsType {
  icon: ReactElement;
  label: string;
  color?: BoxProps['bgcolor'];
}

export default function SquareButton({
  icon,
  label,
  color = 'primary.main',
}: PropsType) {
  return (
    <StyledSquareButton>
      <Box className="icon-container" bgcolor={color}>
        {icon}
      </Box>
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
    </StyledSquareButton>
  );
}
