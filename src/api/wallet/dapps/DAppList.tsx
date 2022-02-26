import React from "react";
import { Divider, List } from "@material-ui/core";
import DAppListElement from "./DAppListElement";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { RouteMap, getRoute } from "../../../router/routerMap";
import { WalletPagePropsType } from "../../../utils/interface";
import { apps } from "./dapps";


interface DAppListPropsTypes extends WalletPagePropsType, RouteComponentProps<{ id: string }> {

}

class DAppList extends React.Component<DAppListPropsTypes, {}> {
    componentDidMount = () => {
        this.props.setTab("dApps");
    };

    render = () => {
        return (
            <List>
                {apps.map((app, index) => (
                    <React.Fragment key={`app-${index}`}>
                        <DAppListElement
                            handleClick={() => this.props.history.push(getRoute(RouteMap.WalletDAppView, {
                                id: this.props.match.params.id,
                                dAppId: app.id
                            }))}
                            name={app.name}
                            description={app.description}
                        />
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        );
    };
}

export default withRouter(DAppList);
