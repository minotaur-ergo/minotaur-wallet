import { ReactElement, ReactNode } from 'react';

import { Box, Typography, styled, useTheme } from '@mui/material';

const AppBox = styled(Box)(
  () => `
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  & .appbar {
    display: grid;
    grid-template-columns: 1fr 1fr; 
    grid-template-rows: 1fr;
    position: sticky;
    top: 0;
    z-index: 1100;
    & .navigation { 
      grid-area: 1 / 1 / 2 / 2; 
      display: flex;
      flex-direction: row;
      justify-content: start;
    }
    & .actions { 
      grid-area: 1 / 2 / 2 / 3; 
      display: flex;
      flex-direction: row;
      justify-content: end;
    }
    & h1 { 
      grid-area: 1 / 1 / 2 / 3; 
      text-align: center;
      font-size: 1.3rem;
      line-height: 40px;
    }
  }
  
  & .content {
    flex-grow: 1;
    overflow-Y: auto;
  }
  
  & .toolbar {
    width: auto;
  }
  
  & .background {
    background-color: #f8f8f8;
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    & svg {
      width: 100%;
      opacity: 0.1;
      filter: blur(50px);
    }
  }
`,
);

interface AppFramePropsType {
  title: string;
  navigation?: ReactElement;
  actions?: ReactElement;
  toolbar?: ReactElement;
  disableToolbarPadding?: boolean;
  children?: ReactNode;
  className?: string;
}

const AppFrame = ({
  title,
  navigation,
  actions,
  toolbar,
  disableToolbarPadding = false,
  children,
  className,
}: AppFramePropsType) => {
  const theme = useTheme();
  const PADDING = 2;
  return (
    <AppBox className={className}>
      <Box className="background">
        <svg viewBox="0 0 100 100">
          <circle cx={0} cy={0} r={60} fill={theme.palette.secondary.main} />
          <circle cx={100} cy={20} r={60} fill={theme.palette.primary.main} />
        </svg>
      </Box>
      <Box className="appbar" p={PADDING}>
        <Box className="navigation">{navigation}</Box>
        <Box className="actions">{actions}</Box>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
      </Box>
      <Box className="content" p={PADDING + 1}>
        {children}
      </Box>
      {toolbar && (
        <Box className="toolbar" p={disableToolbarPadding ? 0 : PADDING}>
          {toolbar}
        </Box>
      )}
    </AppBox>
  );
};

export default AppFrame;
