import { ReactNode } from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import theme from './createAppTheme';

interface PropsType {
  children?: ReactNode;
}

const AppTheme = (props: PropsType) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default AppTheme;
