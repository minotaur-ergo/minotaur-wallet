import React from "react";
import { WalletPagePropsType } from "../WalletPage";
import { getWalletTokens } from "../../../db/action/boxContent";
import { Divider, List, ListItem, ListItemText } from "@material-ui/core";
import TokenName from "../../../components/TokenName";
import DisplayId from "../../../components/DisplayId";
import Erg from "../../../components/Erg";

interface StateType {
    assets: Array<{ tokenId: string, total: string }>;
    loadedWalletId: number;
}

class AssetList extends React.Component<WalletPagePropsType, StateType> {
    state = {
        assets: [],
        loadedWalletId: -1
    };
    load_assets = () => {
        if (this.state.loadedWalletId !== this.props.wallet.id) {
            const wallet_id = this.props.wallet.id;
            getWalletTokens(wallet_id).then(tokens => {
                this.setState({ assets: tokens, loadedWalletId: wallet_id });
            });
        }
    };
    componentDidMount = () => {
        this.props.setTab("assets");
        this.load_assets();
    };
    componentDidUpdate = (prevProps: Readonly<WalletPagePropsType>, prevState: Readonly<StateType>, snapshot?: any) => {
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
                                    <Erg token={item.tokenId} erg={BigInt(item.total)} />
                                </span>
                                    <TokenName token_id={item.tokenId} />
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
