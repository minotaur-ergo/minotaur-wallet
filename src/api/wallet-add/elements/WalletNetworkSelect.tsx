import React from "react";
import { NETWORK_TYPES } from "../../../config/network_type";
import { Grid } from "@material-ui/core";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

interface PropType {
    network: string
    setNetworkType: (network: string) => any;
}

const WalletNetworkSelect = (props: PropType) => {
    if(NETWORK_TYPES.length <= 1) return null
    const width = 100 / NETWORK_TYPES.length;
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                Select network type for this wallet
            </Grid>
            <Grid item xs={12}>
                <ToggleButtonGroup
                    color="primary"
                    size="medium"
                    style={{ width: "100%" }}
                    value={props.network}
                    exclusive
                    onChange={(event, newType) => props.setNetworkType(newType)}
                >
                    {NETWORK_TYPES.map((item, index) => (
                        <ToggleButton key={index} style={{ width: `${width}%` }} value={item.label}>
                            {item.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Grid>
        </Grid>
    );
};

export default WalletNetworkSelect;
