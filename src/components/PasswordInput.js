import React, { useState } from "react";
import {
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";


class PasswordInput extends React.Component {
    state = {
        password: '',
        blurred: false,
        showPassword: false,
    }

    componentDidMount() {
        this.setState({password: this.props.password})
    }

    toggleShowPassword = () => {
        this.setState(state => ({...state, showPassword: !state.showPassword}));
    }

    setPassword = (password) => {
        this.setState({password: password});
        this.props.setPassword(password)
    }

    render = () => {
        return (
            <Grid item xs={12} spacing={2}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>{this.props.label}</InputLabel>
                    <OutlinedInput
                        label={this.props.label}
                        error={this.props.error !== '' && this.state.blurred}
                        onBlur={() => this.setState({blurred: true})}
                        type={this.state.showPassword ? 'text' : 'password'}
                        value={this.state.password}
                        onChange={(event) => this.setPassword(event.target.value)}
                        autoComplete="off"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={this.toggleShowPassword}
                                    onMouseDown={(event) => event.preventDefault()}
                                    edge="end"
                                >
                                    {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                {this.state.blurred ? (
                    <FormHelperText error id="accountId-error">
                        {this.props.error}
                    </FormHelperText>
                ) : null}
            </Grid>
        )
    }
}

export default PasswordInput;
