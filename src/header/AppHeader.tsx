import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { ArrowBack } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));

interface propTypes extends RouteComponentProps {
    title: string;
    back?: () => any;
    hideQrCode?: boolean;
    openQrCode?: () => any;
    extraIcons?: React.ReactNode | Array<React.ReactNode>,
}

const WalletHeader = (props: propTypes) => {
    const back = () => {
        if (props.back) {
            props.back();
        } else {
            props.history.goBack();
        }
    };
    const classes = useStyles();
    return (
        <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={back}>
                <ArrowBack />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                {props.title}
            </Typography>
            {props.extraIcons ? props.extraIcons : null}
            {props.hideQrCode ? null : (
                <IconButton aria-label="show 17 new notifications" color="inherit" onClick={props.openQrCode}>
                    <FontAwesomeIcon icon={faQrcode} />
                </IconButton>
            )}
        </Toolbar>
    );
};

export default withRouter(WalletHeader);
