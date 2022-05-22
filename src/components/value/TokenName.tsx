import React from "react";
// import { getAssetByAssetId } from "../db/action/asset";
import Asset from "../../db/entities/Asset";
import { AssetDbAction } from "../../action/db";

interface PropsType {
    token_id: string;
    network_type: string
}
interface StateType {
    token?: Asset | null;
    loadedTokenId: string;
    loadedNetwork: string;
    loading: boolean;
}

class TokenName extends React.Component<PropsType, StateType> {
    state: StateType = {
        loadedNetwork: "",
        loading: false,
        loadedTokenId: ""
    }

    loadToken = () => {
        if(!this.state.loading && (this.state.loadedTokenId !== this.props.token_id || this.state.loadedNetwork !== this.props.network_type)){
            const loadingTokenId = this.props.token_id;
            const loadingNetworkType = this.props.network_type;
            this.setState({loading: true})
            AssetDbAction.getAssetByAssetId(loadingTokenId, loadingNetworkType).then(tokens => {
                this.setState({
                    token: tokens,
                    loading: false,
                    loadedTokenId: loadingTokenId,
                    loadedNetwork: loadingNetworkType
                })
            });
        }

    }

    componentDidMount = () => {
        this.loadToken()
    }

    componentDidUpdate = () => {
        this.loadToken()
    }

    render = () => {
        const name = this.state.token ? this.state.token.name : this.props.token_id.substring(0, 5) + "..." + this.props.token_id.substring(this.props.token_id.length - 6);
        return (
            <span>{name}</span>
        )
    }
}

export default TokenName;
