import { IconButton, IconButtonProps, styled } from '@mui/material';

interface ToggleIconButtonPropsType extends IconButtonProps {
  selected?: boolean;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  '&.selected': {
    backgroundColor: `${theme.palette.primary.light}80`,
  },
}));

const ToggleIconButton = ({
                                           selected,
                                           color = 'primary',
                                           className,
                                           ...restProps
                                         }: ToggleIconButtonPropsType) => {
  return (
    <StyledIconButton
      {...restProps}
      color={selected ? color : 'default'}
      className={(selected ? 'selected ' : '') + className}
    />
  );
}

export default ToggleIconButton;