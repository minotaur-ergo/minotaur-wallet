import React from "react";
import { Divider, ListItem, ListItemText } from "@material-ui/core";
import Erg from "../Erg";
interface PropsType {
    assets: {[id:string] : bigint};
    sign: -1 | 1;
    title: string;
    description: string;
}
const TotalAmount = (props: PropsType) => {
    const signBigInt = BigInt(props.sign)
    if (Object.entries(props.assets).filter(item => item[1] * signBigInt > 0).length === 0){
        return null
    }
    return (
        <React.Fragment>
            <ListItem>
                <ListItemText
                    primary={props.title}
                    secondary={props.description} />
            </ListItem>
            {Object.entries(props.assets).map(([key, value]) => value * signBigInt > 0 ? (
                <ListItem>
                    <Erg
                        erg={signBigInt * value}
                        showUnit={true}
                        token={key === "erg" ? undefined : key} />
                </ListItem>
            ) : null)}
            <Divider />
        </React.Fragment>
    )
}

export default TotalAmount
