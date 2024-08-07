import { Button, styled } from '@mui/material';

const FloatingButton = styled(Button)(
  ({ theme }) => `
    position: absolute;
    bottom: ${theme.spacing(3)};
    right: ${theme.spacing(3)};
    min-width: 56px;
    width: 56px;
    height: 56px;
    border-radius: 56px;
    box-shadow: ${theme.shadows[2]}!important;
  `
);

export default FloatingButton;
