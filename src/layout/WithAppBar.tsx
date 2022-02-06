import React, { ReactElement } from "react";
import { AppBar, Toolbar } from "@material-ui/core";

interface propType {
    header: ReactElement,
    children: React.ReactNode
}

const WithAppBar = (props: propType) => {
    return (
        <React.Fragment>
            <AppBar position="fixed">
                {props.header}
            </AppBar>
            <Toolbar />
            {props.children}
        </React.Fragment>
    );
};

export default WithAppBar;
