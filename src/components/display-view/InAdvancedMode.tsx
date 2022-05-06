import React from "react";
import { GlobalStateType } from "../../store/reducer";
import { connect } from "react-redux";
import { DisplayType } from "../../store/reducer/wallet";

interface InAdvancedModePropsType {
    children?: React.ReactNode;
    display: DisplayType;
}

const InAdvancedMode = (props: InAdvancedModePropsType) => {
    return (
        <React.Fragment>
            {props.display === "advanced" ? props.children : null}
        </React.Fragment>
    )
}

const mapStateToProps = (state: GlobalStateType) => ({
    display: state.wallet.display
});

export default connect(mapStateToProps)(InAdvancedMode);
