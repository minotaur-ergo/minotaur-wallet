import React from "react";
import TokenWithAddress from "../../../db/entities/views/AddressToken";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TokenName from "../../value/TokenName";

interface PropsType {
    tokens: Array<TokenWithAddress>;
    addToken: (tokenId: string) => any;
    network_type: string
}

const TokenSelect = (props: PropsType) => {
    if(props.tokens && props.tokens.length > 0) {
        const token_ids = Array.from((new Set(props.tokens.map(item => item.token_id))))
        return (
            <FormControl fullWidth variant="outlined" size="small" style={{ marginTop: 15 }}>
                <InputLabel>Add Token</InputLabel>
                <Select
                    value={-1}
                    label="Add Token"
                    onChange={event => props.addToken(event.target.value as string)}
                >
                    {token_ids.map(item => <MenuItem
                        key={item}
                        value={item}>
                        <TokenName token_id={item} network_type={props.network_type}/>
                    </MenuItem>)}
                </Select>
            </FormControl>
        );
    }
    return null
};

export default TokenSelect;
