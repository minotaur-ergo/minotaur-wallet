import { Stack, styled } from '@mui/material';

const FabStack = styled(Stack)(
  ({ theme }) => `
  position: absolute;
  bottom: ${theme.spacing(3)};
  right: ${theme.spacing(3)};
  min-width: 56px;
`,
);

export default FabStack;
