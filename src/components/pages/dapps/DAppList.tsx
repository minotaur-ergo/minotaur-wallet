import React from "react";
import DAppListElement from "./DAppListElement";
import { apps } from "./dapps";
import { WalletPagePropsType } from "../../../util/interface";
import { Divider, List } from "@mui/material";
import { Navigate } from "react-router-dom";
import { getRoute, RouteMap } from "../../route/routerMap";

interface DAppListStateType {
    gotoDAppId?: string;
}

class DAppList extends React.Component<WalletPagePropsType, DAppListStateType> {
    state: DAppListStateType = {}
    componentDidMount = () => {
        this.props.setTab("dApps");
    };

    render = () => {
        return (
            <List>
                {this.state.gotoDAppId ? <Navigate to={getRoute(RouteMap.WalletDAppView, {id: this.props.wallet.id, dAppId: this.state.gotoDAppId})}/> : null}
                {apps.map((app, index) => (
                    <React.Fragment key={`app-${index}`}>
                        <DAppListElement
                            handleClick={() => this.setState({gotoDAppId: app.id})}
                            name={app.name}
                            description={app.description}
                        />
                        <Divider/>
                    </React.Fragment>
                ))}
            </List>
        );
    };
}

export default DAppList;
