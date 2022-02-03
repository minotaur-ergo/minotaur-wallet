import React from "react";
import { FormControl, TextField } from "@material-ui/core";

interface PropsType {
    value: string;
    setValue: (value: string) => any;
    size?: "small" | "medium";
    label: React.ReactNode
}

const ErgoAmount = (props: PropsType) => {
    return (
        <FormControl fullWidth style={{ marginTop: 15 }} variant="outlined">
            <TextField
                label={props.label}
                type="text"
                variant="outlined"
                size={props.size ? props.size : "medium"}
                value={props.value}
                // inputProps={/[0-9]+(\.[0-9]{0,9})?/}
                onChange={(event) => props.setValue(event.target.value)}
                autoComplete="off"
                // InputProps={{
                //     endAdornment: (
                //         <InputAdornment position="end">
                //             <IconButton
                //                 onMouseDown={(event) => props.fillRemaining()}
                //                 edge="end"
                //             >
                //                 <FontAwesomeIcon icon={faArrowDown} />
                //             </IconButton>
                //         </InputAdornment>
                //     )
                // }}
            />
        </FormControl>
    );
};

export default ErgoAmount;
