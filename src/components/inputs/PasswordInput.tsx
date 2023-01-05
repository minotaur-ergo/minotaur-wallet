import React, { useState } from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PropsType {
  password: string;
  label: string;
  error?: string;
  setPassword: (password: string) => unknown;
  size?: 'small' | 'medium';
}

const PasswordInput = (props: PropsType) => {
  const [blurred, setBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  return (
    <Grid item xs={12}>
      <FormControl fullWidth variant="outlined">
        <TextField
          variant="outlined"
          size={props.size ? props.size : 'medium'}
          label={props.label}
          error={props.error !== '' && blurred}
          onBlur={() => setBlurred(true)}
          type={showPassword ? 'text' : 'password'}
          value={props.password}
          onChange={(event) => props.setPassword(event.target.value)}
          autoComplete="off"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShowPassword}
                  onMouseDown={(event) => event.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      {blurred ? (
        <FormHelperText error id="accountId-error">
          {props.error}
        </FormHelperText>
      ) : null}
    </Grid>
  );
};

export default PasswordInput;
