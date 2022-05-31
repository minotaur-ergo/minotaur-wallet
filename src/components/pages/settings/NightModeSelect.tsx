import React from "react";
import { GlobalStateType } from "../../../store/reducer";
import { connect, MapDispatchToProps } from "react-redux";
import { DisplayType } from "../../../store/reducer/wallet";
import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";


interface DisplayModeSelectPropsType {
    display: DisplayType;
}

const DisplayModeSelect = (props: DisplayModeSelectPropsType) => {
    return (
        <React.Fragment>
            <Grid item xs={12}>
                Select Theme
            </Grid>
            <Grid item xs={12}>
                <ToggleButtonGroup
                    color="primary"
                    size="medium"
                    style={{ width: "100%" }}
                    value="light"
                    exclusive
                    // onChange={(event, newType) => props.setDisplay(newType)}
                >
                    <ToggleButton style={{ width: `50%` }} value="light">
                        <FontAwesomeIcon icon={faSun} size={"lg"}/> &nbsp;
                        Light
                    </ToggleButton>
                    <ToggleButton style={{ width: `50%` }} value="dark">
                        <FontAwesomeIcon icon={faMoon} size={"lg"}/> &nbsp;
                        Dark
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
        </React.Fragment>
    )
}

const mapStateToProps = (state: GlobalStateType) => ({
    display: state.wallet.display
});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    // showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant))
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayModeSelect);
