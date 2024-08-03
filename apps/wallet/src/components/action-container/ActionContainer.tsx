import { Box, styled } from '@mui/material';

const ActionContainer = styled(Box)(
  ({ theme }) => `
    position: absolute;
    right: ${theme.spacing(3)};
    bottom: ${theme.spacing(3)};
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 16px;
    & .MuiInputBase-root {
      background-color: #fff;
      box-shadow: ${theme.shadows[2]};
    }
  `,
);

export default ActionContainer;
