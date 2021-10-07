import React from "react";
import { AppBar, makeStyles, Toolbar } from "@material-ui/core";


const useStyles = makeStyles(theme => {
    console.log(theme);
    return {
        offset: theme.mixins.toolbar,
    }
})

const WithAppBar = props => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <AppBar position="fixed">
                {props.header}
            </AppBar>
            <Toolbar/>
            {props.children}
        </React.Fragment>
    )
}

export default WithAppBar
