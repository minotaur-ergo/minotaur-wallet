import React from "react";
import { Badge, ListItem, ListItemText } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Erg from "../../../components/Erg";


interface PropsType extends RouteComponentProps<{ id: string }> {
    address: string;
    id: number;
    name: string;
    erg: bigint;
    handleClick: () => any;
    token_count: number;
}

const RenderName = (props: PropsType) => {
    return (
        <div>
            <div style={{ float: "right" }}>
                <Erg erg={props.erg} showUnit={true} />
                <div>
                    <div style={{ float: "right", marginRight: 10 }}>
                        {props.token_count ? <Badge badgeContent={"+" + props.token_count} color="primary" /> : ""}
                    </div>
                </div>
            </div>
            {props.name}
        </div>
    );
};

const AddressElement = (props: PropsType) => {
    const address = props.address.length > 30 ? props.address.substr(0, 15) + "..." + props.address.substr(props.address.length - 15) : props.address;
    return (
        <ListItem onClick={props.handleClick}>
            <ListItemText primary={<RenderName {...props} />} secondary={address} />
        </ListItem>
    );
};

export default withRouter(AddressElement);
