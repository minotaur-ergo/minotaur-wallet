import React from "react";
import * as wasm from "ergo-lib-wasm-browser";
import { Divider, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import RawBox from "./RawBox";
import BottomSheet from "../bottom-sheet/BottomSheet";
import { ErgoBoxCandidate } from "ergo-lib-wasm-browser";
import { InputBox } from "../../network/models";

interface PropsType {
    show: boolean;
    inputs?: Array<wasm.ErgoBox>;
    inputsJs?: Array<InputBox>
    close: () => any;
    outputs: Array<wasm.ErgoBox | ErgoBoxCandidate>;
    allowedAssets?: Array<string>;
    network_type: string;
}

const TxBoxDisplay = (props: PropsType) => {
    return (
        <BottomSheet show={props.show} close={props.close}>
            <Grid container>
                <Grid item xs={12}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Transaction Inputs" secondary="These element spent in transaction" />
                        </ListItem>
                        {props.inputs ? props.inputs.map((item, index) => (
                            <RawBox
                                allowedAssets={props.allowedAssets}
                                box={item}
                                key={index}
                                network_type={props.network_type} />
                        )) : props.inputsJs ? props.inputsJs.map((item, index) => (
                            <RawBox
                                allowedAssets={props.allowedAssets}
                                boxJs={item}
                                key={index}
                                network_type={props.network_type} />
                        )) : null}
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Transaction Outputs"
                                secondary="These element will be created in transaction" />
                        </ListItem>
                        {props.outputs.map((item, index) => (
                            <RawBox
                                allowedAssets={props.allowedAssets}
                                box={item}
                                key={index}
                                network_type={props.network_type} />
                        ))}
                    </List>
                </Grid>
            </Grid>
        </BottomSheet>
    );
};

export default TxBoxDisplay;
