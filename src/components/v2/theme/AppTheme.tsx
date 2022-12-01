import React, { ReactNode } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';

interface PropsType {
  children?: ReactNode;
}

export default function AppTheme(props: PropsType) {
  const theme = createTheme({
    palette: {
      primary: {
        light: '#3784fa',
        main: '#0561f0',
        dark: '#022964',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ffcb4b',
        main: '#fbae01',
        dark: '#7a5600',
        contrastText: '#fff',
      },
    },
  });

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
