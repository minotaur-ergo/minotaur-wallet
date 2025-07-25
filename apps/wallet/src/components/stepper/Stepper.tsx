import { ReactElement } from 'react';

import { Box, Stack, styled } from '@mui/material';

const Step = styled(Box)(
  ({ theme }) => `
  width: 2rem;
  height: 0.75rem;
  background-color: ${theme.palette.divider};
  border-radius: 1rem;
  &.past {
    background-color: ${theme.palette.primary.dark};
  }
  &.active {
    background-color: ${theme.palette.primary.main};
  }
`,
);

interface StepperPropsType {
  children: Array<ReactElement>;
  activeStep: number;
}

const Stepper = (props: StepperPropsType) => {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 3, justifyContent: 'center' }}
      >
        {props.children.map((_item, index) => (
          <Step
            className={
              props.activeStep === index + 1
                ? 'active'
                : props.activeStep > index + 1
                  ? 'past'
                  : ''
            }
            key={index}
          />
        ))}
      </Stack>
      <Box>{props.children[props.activeStep - 1]}</Box>
    </Box>
  );
};

export default Stepper;
