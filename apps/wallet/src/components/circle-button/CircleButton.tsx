import { Button, styled } from '@mui/material';

const CircleButton = styled(Button)(
  ({ theme }) => `
    min-width: 56px;
    width: 56px;
    border-radius: 56px;
    box-shadow: ${theme.shadows[2]}!important;
  `,
);

export default CircleButton;
