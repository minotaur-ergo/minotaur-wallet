import React from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType } from '@minotaur-ergo/types';

interface InAdvancedModePropsType {
  children?: React.ReactNode;
}

const InAdvancedMode = (props: InAdvancedModePropsType) => {
  const display: string = useSelector(
    (state: GlobalStateType) => state.config.display,
  );
  return (
    <React.Fragment>
      {display === 'advanced' ? props.children : null}
    </React.Fragment>
  );
};

export default InAdvancedMode;
