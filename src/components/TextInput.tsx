import React, { useState } from 'react';
import {
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput
} from "@material-ui/core";

interface PropsType{
    label: string | React.ReactElement;
    error: string;
    value: string;
    setValue: (value: string) => any;
    type?: string;
}

const TextInput = (props: PropsType) => {
    const [blurred, setBlurred] = useState(false);
    return (
      <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
              <InputLabel>{props.label}</InputLabel>
              <OutlinedInput
                label={props.label}
                error={props.error !== '' && blurred}
                onBlur={() => setBlurred(true)}
                type={props.type ? props.type : "text"}
                value={props.value}
                onChange={(event) => props.setValue(event.target.value)}
                autoComplete="off"
              />
          </FormControl>
          {blurred ? (
            <FormHelperText error id="accountId-error">
                {props.error}
            </FormHelperText>
          ) : null}
      </Grid>
    )
}

export default TextInput;
