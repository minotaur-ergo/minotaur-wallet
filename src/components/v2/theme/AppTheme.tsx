import React, { ReactNode } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';

interface PropsType {
  children?: ReactNode;
}

export default function AppTheme(props: PropsType) {
  const BORDER_RADIUS = 12;
  const INPUT_BG_COLOR = '#ffffff88';
  const { shadows } = createTheme();
  shadows[1] =
    'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px';
  shadows[2] =
    'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px';
  shadows[3] = 'rgba(0, 0, 0, 0.35) 0px 25px 20px -20px';

  const theme = createTheme({
    palette: {
      primary: {
        light: '#3784fa',
        main: '#0561f0',
        dark: '#022964',
        contrastText: '#fff',
      },
      secondary: {
        light: '#fde3a6',
        main: '#fbae01',
        dark: '#7a5600',
        contrastText: '#fff',
      },
      success: {
        light: '#00ff0a',
        main: '#2f7f57',
        dark: '#1b5e20',
        contrastText: '#fff',
      },
      error: {
        light: '#ff2828',
        main: '#d32f2f',
        dark: '#c62828',
        contrastText: '#fff',
      },
    },
    shape: {
      borderRadius: BORDER_RADIUS,
    },
    typography: {
      h1: {
        fontSize: '1.1rem',
        fontWeight: 600,
        flexGrow: 1,
      },
      h2: {
        fontSize: '1rem',
        fontWeight: 600,
        flexGrow: 1,
      },
      h3: {
        fontSize: '0.875rem',
        fontWeight: 400,
        flexGrow: 1,
      },
      h4: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    shadows,
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
          fullWidth: true,
        },
        styleOverrides: {
          root: {
            padding: '0.75rem',
            textTransform: 'none',
          },
          sizeMedium: {
            fontSize: '1rem',
          },
          outlined: {
            backgroundColor: '#eaeaea',
            border: 0,
            '&:focus': {
              backgroundColor: '#eaeaea',
              border: 0,
            },
          },
          containedSizeSmall: {
            padding: '0.5rem',
          },
        },
      },
      MuiFormControl: {
        defaultProps: {
          variant: 'filled',
          fullWidth: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'filled',
          fullWidth: true,
        },
      },
      MuiFilledInput: {
        defaultProps: {
          disableUnderline: true,
        },
        styleOverrides: {
          root: {
            backgroundColor: INPUT_BG_COLOR,
            borderRadius: BORDER_RADIUS,
            '&.Mui-focused': {
              backgroundColor: '#fff',
            },
          },
        },
      },
      MuiToggleButtonGroup: {
        defaultProps: {
          fullWidth: true,
        },
        styleOverrides: {
          root: {
            backgroundColor: INPUT_BG_COLOR,
          },
          grouped: {
            border: 0,
            margin: 4,
            '&:not(:first-of-type)': {
              borderRadius: BORDER_RADIUS,
            },
            '&:first-of-type': {
              borderRadius: BORDER_RADIUS,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffffa8',
          },
        },
      },
      MuiAlertTitle: {
        styleOverrides: {
          root: {
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: 0,
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          markActive: {
            backgroundColor: '#0561f0',
          },
          mark: {
            width: 8,
            height: 8,
            borderRadius: 8,
            backgroundColor: '#9cbff5',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            padding: '8px 24px 24px',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            maxHeight: 'calc(100vh - 100px)',
          },
        },
      },
    },
  });

  console.log(theme.palette);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
