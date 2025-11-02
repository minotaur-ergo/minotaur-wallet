import { ReactNode } from 'react';

import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

interface PropsType {
  children?: ReactNode;
}
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
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.25rem',
      flexGrow: 1,
    },
    h4: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: '1rem',
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
          textTransform: 'none',
        },
        sizeMedium: {
          padding: '0.75rem',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '0.25rem 0.5rem',
        },
        outlined: {
          'backgroundColor': '#eaeaea80',
          'border': 0,
          '&:focus': {
            backgroundColor: '#eaeaea',
            border: 0,
          },
          '&:hover': {
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
          'backgroundColor': INPUT_BG_COLOR,
          'borderRadius': BORDER_RADIUS,
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
          'border': 0,
          'margin': 4,
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
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:last-child': {
            padding: theme.spacing(2),
          },
        }),
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
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: '8px',
        },
      },
    },
  },
});

const AppTheme = (props: PropsType) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default AppTheme;
