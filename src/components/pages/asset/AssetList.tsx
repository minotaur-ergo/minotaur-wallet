import React from "react";
import { WalletPagePropsType } from "../../../util/interface";
import { BoxContentDbAction } from "../../../action/db";
import { Divider, List, ListItem, ListItemText } from "@mui/material";
import Erg from "../../value/Erg";
import TokenName from "../../value/TokenName";
import DisplayId from "../../display-id/DisplayId";

interface AssetListStateType {
    assets: Array<{ tokenId: string, total: string }>;
    loadedWalletId: number;
}

class AssetList extends React.Component<WalletPagePropsType, AssetListStateType> {
    state: AssetListStateType = {
        assets: [],
        loadedWalletId: -1
    };
    load_assets = () => {
        if (this.state.loadedWalletId !== this.props.wallet.id) {
            const wallet_id = this.props.wallet.id;
            BoxContentDbAction.getWalletTokens(wallet_id).then(tokens => {
                this.setState({ assets: tokens, loadedWalletId: wallet_id });
            });
        }
    };
    componentDidMount = () => {
        this.props.setTab("assets");
        this.load_assets();
    };
    componentDidUpdate = () => {
        this.load_assets();
    };

    render = () => {
        return (
            <List>
                {this.state.assets.length > 0 ? this.state.assets.map((item: { tokenId: string, total: string }) => (
                    <React.Fragment key={item.tokenId}>
                        <ListItem>
                            <ListItemText primary={(
                                <React.Fragment>
                                <span style={{ float: "right", display: "block" }}>
                                    <Erg token={item.tokenId} erg={BigInt(item.total)} network_type={this.props.wallet.network_type}/>
                                </span>
                                    <TokenName token_id={item.tokenId} network_type={this.props.wallet.network_type}/>
                                </React.Fragment>
                            )} secondary={(
                                <DisplayId id={item.tokenId} />
                            )} />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                )) : (
                    <ListItem>
                        <ListItemText
                            primary={"You have no assets yet"}
                            secondary={"You can issue new asset using Issue Token DApp"} />
                    </ListItem>
                )}
            </List>
        );
    };
};


export default AssetList;
