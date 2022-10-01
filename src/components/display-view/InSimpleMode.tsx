import React from 'react';
import { GlobalStateType } from '../../store/reducer';
import { connect } from 'react-redux';
import { DisplayType } from '../../store/reducer/wallet';

interface InSimpleModePropsType {
  children?: React.ReactNode;
  display: DisplayType;
}

const InSimpleMode = (props: InSimpleModePropsType) => {
  return (
    <React.Fragment>
      {props.display === 'simple' ? props.children : null}
    </React.Fragment>
  );
};

const mapStateToProps = (state: GlobalStateType) => ({
  display: state.wallet.display,
});
export default connect(mapStateToProps)(InSimpleMode);
