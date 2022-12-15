import React, { ReactElement } from 'react';
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
`
);

interface PropsType {
  children: Array<ReactElement>;
  activeStep: number;
}

export default function Stepper({ activeStep, children }: PropsType) {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 3, justifyContent: 'center' }}
      >
        {children.map((item, index) => (
          <Step
            className={
              activeStep === index + 1
                ? 'active'
                : activeStep > index + 1
                ? 'past'
                : ''
            }
            key={index}
          />
        ))}
      </Stack>
      {children.map((item, index) => (
        <Box
          sx={{ display: activeStep === index + 1 ? 'block' : 'none' }}
          key={index}
        >
          {item}
        </Box>
      ))}
    </Box>
  );
}
