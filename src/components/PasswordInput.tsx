import React, { useState } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

interface PropsType {
  password: string;
  label: string
  error?: string;
  setPassword: (password: string) => any;
}

const PasswordInput = (props: PropsType) => {
  const [blurred, setBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  return (
    <Grid item xs={12}>
      <FormControl fullWidth variant='outlined'>
        <InputLabel>{props.label}</InputLabel>
        <OutlinedInput
          label={props.label}
          error={props.error !== '' && blurred}
          onBlur={() => setBlurred(true)}
          type={showPassword ? 'text' : 'password'}
          value={props.password}
          onChange={(event) => props.setPassword(event.target.value)}
          autoComplete='off'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={toggleShowPassword}
                onMouseDown={(event) => event.preventDefault()}
                edge='end'
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      {blurred ? (
        <FormHelperText error id='accountId-error'>
          {props.error}
        </FormHelperText>
      ) : null}
    </Grid>
  );
};

export default PasswordInput;
