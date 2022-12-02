import React, { ReactNode } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import { blueGrey } from '@mui/material/colors';
import { PaletteColorOptions } from '@mui/material';

// declare module '@mui/material/styles' {
//   interface CustomPalette {
//     neutral?: PaletteColorOptions;
//   }
//   interface Palette extends CustomPalette {}
//   interface PaletteOptions extends CustomPalette {}
// }
//
// declare module '@mui/material/Button' {
//   interface ButtonPropsColorOverrides {
//     neutral: true;
//   }
// }

interface PropsType {
  children?: ReactNode;
}

export default function AppTheme(props: PropsType) {
  const BORDER_RADIUS = 12;
  const INPUT_BG_COLOR = '#ffffff88';
  const { palette } = createTheme();
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
      // neutral: palette.augmentColor({ color: blueGrey }),
    },
    shape: {
      borderRadius: BORDER_RADIUS,
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
          fullWidth: true,
        },
        styleOverrides: {
          root: {
            padding: '0.75rem',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'filled',
          fullWidth: true,
          margin: 'normal',
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
      MuiSlider: {
        styleOverrides: {
          mark: {
            width: 3,
            height: 6,
            borderRadius: 8,
            borderWidth: 1,
          },
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
