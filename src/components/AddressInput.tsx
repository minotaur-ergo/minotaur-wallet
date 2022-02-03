import React, { useEffect, useState } from "react";
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    TextField
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { GlobalStateType } from "../store/reducer";
import { connect, MapDispatchToProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { failScanResult, showQrCodeScanner } from "../store/actions";


interface PropsType extends RouteComponentProps {
    address: string;
    label: string;
    error?: string;
    setAddress: (password: string) => any;
    scanResult: string;
    scanSuccess: boolean;
    clearScan: () => any;
    openQrCode: () => any;
    size?: "small" | "medium";
}

const AddressInput = (props: PropsType) => {
    const [blurred, setBlurred] = useState(false);
    const startScanner = () => {
        props.openQrCode();
        // props.history.push(getRoute(RouteMap.QrCode, {}));
    };

    useEffect(() => {
        if (props.scanSuccess) {
            if (props.scanResult !== props.address) {
                props.setAddress(props.scanResult);
                props.clearScan();
            }
        }
    });

    return (
        <React.Fragment>
            <FormControl fullWidth variant="outlined" margin={"normal"}>
                <TextField
                    size={props.size ? props.size: "medium"}
                    variant="outlined"
                    label={props.label}
                    error={props.error !== "" && blurred}
                    onBlur={() => setBlurred(true)}
                    type="text"
                    value={props.address}
                    onChange={(event) => props.setAddress(event.target.value)}
                    autoComplete="off"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => startScanner()}
                                    onMouseDown={(event) => event.preventDefault()}
                                    edge="end"
                                >
                                    <FontAwesomeIcon icon={faQrcode} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                {blurred && props.error ? (
                    <FormHelperText error id="accountId-error">
                        {props.error}
                    </FormHelperText>
                ) : null}
            </FormControl>
        </React.Fragment>
    );
};

const mapStateToProps = (state: GlobalStateType) => ({
    scanResult: state.qrcode.scan.content,
    scanSuccess: state.qrcode.scan.valid
});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    clearScan: () => dispatch(failScanResult()),
    openQrCode: () => dispatch(showQrCodeScanner())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddressInput));
