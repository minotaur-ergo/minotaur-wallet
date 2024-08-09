import { IconButton, IconButtonProps, styled } from '@mui/material';

interface PropsType extends IconButtonProps {
  selected?: boolean;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  '&.selected': {
    backgroundColor: `${theme.palette.primary.light}80`,
  },
}));

export default function ToggleIconButton({
  selected,
  color = 'primary',
  className,
  ...restProps
}: PropsType) {
  return (
    <StyledIconButton
      {...restProps}
      color={selected ? color : 'default'}
      className={(selected ? 'selected ' : '') + className}
    />
  );
}
