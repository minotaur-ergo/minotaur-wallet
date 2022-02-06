import React, { useEffect, useState } from "react";
import { erg_nano_erg_to_str } from "../utils/utils";
import { ERG_FACTOR } from "../config/const";
import Asset from "../db/entities/Asset";
import { getAssetByAssetId } from "../db/action/asset";
import TokenName from "./TokenName";

type PropsType = {
    erg: bigint;
    class?: string;
    showUnit?: boolean;
    token?: string;
    network_type: string
}

const Erg = (props: PropsType) => {
    const [token, setToken] = useState<Asset | undefined>();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (props.token) {
            if (!(token && token.asset_id === props.token)) {
                if (!loading) {
                    setLoading(true);
                    getAssetByAssetId(props.token, props.network_type).then(token => {
                        setToken(token);
                        setLoading(true);
                    });
                }
            }
        }
    }, [props.network_type, props.token, token, loading]);
    const maxDecimal = props.token ? (token && token.decimal ? token.decimal : 0) : 9;
    const factor = props.token ? BigInt(Math.pow(10, maxDecimal)) : ERG_FACTOR;
    const erg = props.erg / factor;
    const nano_erg = props.erg - erg * factor;
    const erg_str = erg_nano_erg_to_str(erg, nano_erg, 2, maxDecimal);
    const unit = props.showUnit ? props.token ? <TokenName token_id={props.token} network_type={props.network_type}/> : " erg" : "";
    return (
        <span className={props.class}>{erg_str} {unit}</span>
    );
};

export default Erg;
