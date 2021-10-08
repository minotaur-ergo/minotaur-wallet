import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";


const WithAppBar = props => {
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
