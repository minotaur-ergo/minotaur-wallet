import { GlobalStateType } from '../../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { DisplayType } from '../../../store/reducer/wallet';
import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import { setDisplayMode } from '../../../store/actions';

interface DisplayModeSelectPropsType {
  display: DisplayType;
  setMode: (mode: DisplayType) => any;
}

const DisplayModeSelect = (props: DisplayModeSelectPropsType) => {
  return (
    <React.Fragment>
      <Grid item xs={12}>
        Wallet details mode
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          color="primary"
          size="medium"
          style={{ width: '100%' }}
          value={props.display}
          exclusive
          onChange={(event, newType) => props.setMode(newType)}
        >
          <ToggleButton style={{ width: `50%` }} value="simple">
            Simple
          </ToggleButton>
          <ToggleButton style={{ width: `50%` }} value="advanced">
            Advanced
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = (state: GlobalStateType) => ({
  display: state.wallet.display,
});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  setMode: (mode: DisplayType) => dispatch(setDisplayMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayModeSelect);
