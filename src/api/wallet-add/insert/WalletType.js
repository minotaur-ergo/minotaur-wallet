import React from "react";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSnowflake, faWallet } from "@fortawesome/free-solid-svg-icons";
import { Grid } from "@material-ui/core";

const WalletType = props => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <ToggleButtonGroup
                    color="primary"
                    size="medium"
                    style={{width: "100%"}}
                    value={props.value}
                    exclusive
                    onChange={(event, newType) => props.setValue(newType)}
                >
                    <ToggleButton style={{width: "50%"}} value="cold"><FontAwesomeIcon
                        icon={faSnowflake}/>&nbsp;Cold</ToggleButton>
                    <ToggleButton style={{width: "50%"}} value="normal"><FontAwesomeIcon
                        icon={faWallet}/>&nbsp;Normal</ToggleButton>
                </ToggleButtonGroup>
            </Grid>
        </Grid>
    )
}

export default WalletType;
