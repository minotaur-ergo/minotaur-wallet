import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { RouteMap } from "../../router/routerMap";
import { Capacitor } from "@capacitor/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

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


const downloadDb = () => {
    try {
        const content = Buffer.from(JSON.parse(localStorage.minotaur).map((item: number) => ("0" + item.toString(16)).slice(-2)).join(""), "hex");
// any kind of extension (.txt,.cpp,.cs,.bat)
        const filename = "db.sqlite3";
        const blob = new Blob([content], {
            type: "octet/stream"
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (e) {
    }
};

const HomeHeader = ({ history }: RouteComponentProps) => {

    const addWalletClickHandler = () => {
        history.push(RouteMap.WalletAdd);
    };
    const classes = useStyles();
    return (
        <Toolbar>
            <Typography variant="h6" className={classes.title}> Minotaur </Typography>
            <IconButton color="inherit" onClick={addWalletClickHandler}> <AddIcon /> </IconButton>
            {Capacitor.getPlatform() === "web" ? (
                <IconButton color="inherit" onClick={downloadDb}> <FontAwesomeIcon icon={faDownload} size={"xs"}/> </IconButton>
            ) : null}
        </Toolbar>
    );
};

export default withRouter(HomeHeader);
