import { ReactElement, ReactNode } from 'react';
import { Box, ThemeProvider, Typography } from '@mui/material';
import AppBox from '../app-box/AppBox';
import theme from './createAppTheme';

interface ExtensionThemePropsType {
  title: string;
  navigation?: ReactElement;
  actions?: ReactElement;
  toolbar?: ReactElement;
  disableToolbarPadding?: boolean;
  children?: ReactNode;
}

const ExtensionTheme = ({
  title,
  navigation,
  actions,
  toolbar,
  disableToolbarPadding = false,
  children,
}: ExtensionThemePropsType) => {
  const PADDING = 2;
  return (
    <ThemeProvider theme={theme}>
      <AppBox>
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
    </ThemeProvider>
  );
};

export default ExtensionTheme;
