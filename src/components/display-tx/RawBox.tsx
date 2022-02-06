import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import Erg from "../Erg";
import * as wasm from "ergo-lib-wasm-browser";
import DisplayId from "../DisplayId";
import { InputBox } from "../../network/models";
import { getNetworkType } from "../../config/network_type";

interface PropsType {
    boxJs?: InputBox;
    box?: wasm.ErgoBox | wasm.ErgoBoxCandidate;
    allowedAssets?: Array<string>;
    network_type: string;
}

const getAssetJsonFromWasm = (box: wasm.ErgoBox | wasm.ErgoBoxCandidate, allowedAssets?: Array<string>): Array<{id: string, amount: bigint}> => {
    const tokens = box.tokens();
    return Array(tokens.len()).fill("").map(
        (item, index) => tokens.get(index)
    ).filter(item=> allowedAssets ? allowedAssets.indexOf(item.id().to_str())>= 0 : true).map(token => {
        return {id: token.id().to_str(), amount: BigInt(token.amount().as_i64().to_str())}
    });
}

const getAssetJsonFromExplorer = (boxJs: InputBox, allowedAssets?: Array<string>): Array<{id: string, amount: bigint}> => {
    return boxJs.assets.filter(item => allowedAssets ? allowedAssets.indexOf(item.tokenId) >= 0 : true).map(token => {
        return {id: token.tokenId, amount: token.amount}
    })
}

const RawBox = (props: PropsType) => {
    const network_type = getNetworkType(props.network_type);
    const assets = props.box ? getAssetJsonFromWasm(props.box) : props.boxJs ? getAssetJsonFromExplorer(props.boxJs) : [];
    const boxValue = props.box ? BigInt(props.box.value().as_i64().to_str()) : props.boxJs ? props.boxJs.value : BigInt("0")
    const address = props.box ?  wasm.Address.recreate_from_ergo_tree(props.box.ergo_tree()).to_base58(network_type.prefix) : props.boxJs ? props.boxJs.address : "";
    return (
        <ListItem>
            <ListItemText
                primary={<DisplayId id={address} />}
                secondary={<React.Fragment>
                    <span style={{display: "block"}}>
                        <Erg
                            network_type={props.network_type}
                            erg={boxValue}
                            showUnit={true} />
                    </span>
                    {assets.map((item, index) => (
                        <span style={{display: "block"}} key={index}>
                            <Erg
                                network_type={props.network_type}
                                erg={item.amount}
                                showUnit={true}
                                token={item.id} />
                        </span>
                    ))}
                </React.Fragment>} />
        </ListItem>
    );
};

export default RawBox;
