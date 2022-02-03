import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import Erg from "../Erg";
import * as wasm from "ergo-lib-wasm-browser";
import DisplayId from "../DisplayId";
import { NETWORK_TYPE } from "../../config/const";

interface PropsType {
    box: wasm.ErgoBox | wasm.ErgoBoxCandidate;
    allowedAssets?: Array<string>;
}

const RawBox = (props: PropsType) => {
    const tokens = props.box.tokens();
    const assets = Array(tokens.len()).fill("").map(
        (item, index) => tokens.get(index)
    ).filter(item=> props.allowedAssets ? props.allowedAssets.indexOf(item.id().to_str())>= 0 : true);
    const address = wasm.Address.recreate_from_ergo_tree(props.box.ergo_tree()).to_base58(NETWORK_TYPE);
    return (
        <ListItem>
            <ListItemText
                primary={<DisplayId id={address} />}
                secondary={<React.Fragment>
                    <span style={{display: "block"}}>
                        <Erg
                            erg={BigInt(props.box.value().as_i64().to_str())}
                            showUnit={true} />
                    </span>
                    {assets.map((item, index) => (
                        <span style={{display: "block"}} key={index}>
                            <Erg
                                erg={BigInt(item.amount().as_i64().to_str())}
                                showUnit={true}
                                token={item.id().to_str()} />
                        </span>
                    ))}
                </React.Fragment>} />
        </ListItem>
    );
};

export default RawBox;
