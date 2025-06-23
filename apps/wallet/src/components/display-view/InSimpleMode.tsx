import React from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType } from '@/store';
import { DisplayType } from '@/store/reducer/config';

interface InSimpleModePropsType {
  children?: React.ReactNode;
  display: DisplayType;
}

const InSimpleMode = (props: InSimpleModePropsType) => {
  const display: string = useSelector(
    (state: GlobalStateType) => state.config.display,
  );
  return (
    <React.Fragment>
      {display === 'simple' ? props.children : null}
    </React.Fragment>
  );
};

export default InSimpleMode;
