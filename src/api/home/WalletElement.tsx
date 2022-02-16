import React from "react";
import { Avatar, Badge, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import Erg from "../../components/Erg";
import { getRoute, RouteMap } from "../../router/routerMap";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { faCoffee, faSnowflake, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WalletType } from "../../db/entities/Wallet";

import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { getNetworkType } from "../../config/network_type";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        orange: {
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: deepOrange[500],
        },
        purple: {
            color: theme.palette.getContrastText(deepPurple[500]),
            backgroundColor: deepPurple[500],
        },
    }),
);

interface propType extends RouteComponentProps {
    type: WalletType;
    id: number;
    name: string;
    erg: bigint;
    tokens: number;
    network_type: string;
}

const WalletElement = (props: propType) => {
    const classes = useStyles();
    const gotoWallet = () => {
        props.history.push(getRoute(RouteMap.WalletTransaction, { "id": props.id }));
    };
    const network_type = getNetworkType(props.network_type);
    return (
        <ListItem onClick={gotoWallet}>
            <ListItemAvatar>
                <Avatar className={network_type.color === "orange" ? classes.orange : network_type.color === "purple" ? classes.purple : ""}>
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

export default withRouter(WalletElement);
