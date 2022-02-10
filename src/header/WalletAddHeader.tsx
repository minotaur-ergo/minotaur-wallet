import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ArrowBack } from "@material-ui/icons";

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

interface PropsType extends RouteComponentProps {
    title: string | React.ReactElement;
}


const WalletAddHeader = (props: PropsType) => {

    const back = () => {
        props.history.goBack();
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
        </Toolbar>
    );
};

export default withRouter(WalletAddHeader);
