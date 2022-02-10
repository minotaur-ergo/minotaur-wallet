import React from "react";
import { Avatar, Badge, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import Erg from "../../components/Erg";
import { getRoute, RouteMap } from "../../router/WalletRouter";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { faCoffee, faSnowflake, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WalletType } from "../../db/entities/Wallet";

interface propType extends RouteComponentProps {
    type: WalletType;
    id: number;
    name: string;
    erg: bigint;
    tokens: number;
    network_type: string;
}

const walletElement = (props: propType) => {
    const gotoWallet = () => {
        props.history.push(getRoute(RouteMap.WalletTransaction, { "id": props.id }));
    };
    return (
        <ListItem onClick={gotoWallet}>
            <ListItemAvatar>
                <Avatar>
                    {props.type === WalletType.Cold ? <FontAwesomeIcon icon={faSnowflake} /> : null}
                    {props.type === WalletType.Normal ? <FontAwesomeIcon icon={faWallet} /> : null}
                    {props.type === WalletType.ReadOnly ? <FontAwesomeIcon icon={faCoffee} /> : null}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={props.name}
                secondary={(
                    <React.Fragment>
                        <Erg erg={props.erg} showUnit={true} network_type={props.network_type} />
                        <span style={{ float: "right", marginRight: 10 }}>
                            {props.tokens ? <Badge badgeContent={"+" + props.tokens} color="primary" /> : ""}
                        </span>
                    </React.Fragment>
                )}
            />
        </ListItem>
    );
};

export default withRouter(walletElement);
