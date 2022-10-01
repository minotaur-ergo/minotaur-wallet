import React, { ReactElement } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

interface propType {
  header: ReactElement;
  children: React.ReactNode;
  hide?: boolean;
}

const WithAppBar = (props: propType) => {
  return (
    <React.Fragment>
      {props.hide ? null : (
        <React.Fragment>
          <AppBar position="fixed">{props.header}</AppBar>
          <Toolbar />
        </React.Fragment>
      )}
      {props.children}
    </React.Fragment>
  );
};

export default WithAppBar;
