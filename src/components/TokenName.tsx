import React, { useEffect, useState } from "react";
import { getAssetByAssetId } from "../db/action/asset";
import Asset from "../db/entities/Asset";

interface PropsType {
    token_id: string;
}

const TokenName = (props: PropsType) => {
    const [token, setToken] = useState<Asset|undefined>();
    useEffect(() => {
        getAssetByAssetId(props.token_id).then(tokens => setToken(tokens));
    }, [props.token_id])
    const name = token ? token.name : props.token_id.substr(0, 5) + "..." + props.token_id.substr(props.token_id.length - 6);
    return (
        <div>{name}</div>
    )
}

export default TokenName;
