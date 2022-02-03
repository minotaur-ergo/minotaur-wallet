import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";


interface PropsType extends RouteComponentProps<{ id: string }> {
    name: string;
    description: string;
    icon?: string;
    url?: string;
    handleClick?: () => any;
}

const DAppListElement = (props: PropsType) => {
    return (
        <ListItem onClick={props.handleClick ? props.handleClick : () => null}>
            <ListItemText primary={props.name} secondary={props.description} />
        </ListItem>
    );
};

export default withRouter(DAppListElement);
