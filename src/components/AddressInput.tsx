import React, { useEffect, useState } from "react";
import { FormControl, FormHelperText, IconButton, InputAdornment, TextField } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { RouteComponentProps, withRouter } from "react-router-dom";
import QrCodeReaderView from "./qrcode/QrCodeReaderView";


interface PropsType extends RouteComponentProps {
    address: string;
    label: string;
    error?: string;
    setAddress: (password: string) => any;
    size?: "small" | "medium";
}

const AddressInput = (props: PropsType) => {
    const [blurred, setBlurred] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);
    const startScanner = () => {
        setShowQrCode(true);
    };

    return (
        <QrCodeReaderView
            fail={() => null}
            open={showQrCode}
            close={() => setShowQrCode(false)}
            success={(scanned) => props.setAddress(scanned)}>
            <FormControl fullWidth variant="outlined" margin={"none"}>
                <TextField
                    size={props.size ? props.size : "medium"}
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
        </QrCodeReaderView>
    );
};

export default withRouter(AddressInput);
