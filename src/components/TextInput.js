import React  from "react";
import {
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    OutlinedInput
} from "@material-ui/core";


class TextInput extends React.Component {
    state = {
        value: '',
        blurred: false,
    }

    componentDidMount() {
        this.setState({value: this.props.value})
    }

    setValue= (value) => {
        this.setState({value: value});
        this.props.setValue(value)
    }

    render = () => {
        return (
            <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>{this.props.label}</InputLabel>
                    <OutlinedInput
                        label={this.props.label}
                        error={this.props.error !== '' && this.state.blurred}
                        onBlur={() => this.setState({blurred: true})}
                        type="text"
                        value={this.state.value}
                        onChange={(event) => this.setValue(event.target.value)}
                        autoComplete="off"
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

export default TextInput;
