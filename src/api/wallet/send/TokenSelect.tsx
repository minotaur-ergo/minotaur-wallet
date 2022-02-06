import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import TokenWithAddress from "../../../db/entities/views/AddressToken";
import TokenName from "../../../components/TokenName";

interface PropsType {
    tokens: Array<TokenWithAddress>;
    addToken: (tokenId: string) => any;
    network_type: string
}

const TokenSelect = (props: PropsType) => {
    if(props.tokens && props.tokens.length > 0) {
        return (
            <FormControl fullWidth variant="outlined" size="small" style={{ marginTop: 15 }}>
                <InputLabel>Add Token</InputLabel>
                <Select
                    value={-1}
                    label="Add Token"
                    onChange={event => props.addToken(event.target.value as string)}
                >
                    {props.tokens.map(item => <MenuItem
                        key={item.token_id}
                        value={item.token_id}>
                        <TokenName token_id={item.token_id} network_type={props.network_type}/>
                    </MenuItem>)}
                </Select>
            </FormControl>
        );
    }
    return null
};

export default TokenSelect;
