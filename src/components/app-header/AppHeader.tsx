import React from "react";
import IconButton from "@mui/material/IconButton";
import { ArrowBack } from "@mui/icons-material";
import { Typography, Toolbar } from "@mui/material";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

interface WalletHeaderPropTypes {
    title: string;
    back?: () => any;
    hideQrCode?: boolean;
    openQrCode?: () => any;
    extraIcons?: React.ReactNode | Array<React.ReactNode>,
}

const WalletHeader = (props: WalletHeaderPropTypes) => {
    const navigate = useNavigate()
    const back = () => {
        if (props.back) {
            props.back();
        } else {
            navigate(-1);
        }
    };
    return (
        <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={back}>
                <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{flexGrow: 1}}>
                {props.title}
            </Typography>
            {props.extraIcons ? props.extraIcons : null}
            {props.hideQrCode ? null : (
                <IconButton color="inherit" onClick={props.openQrCode}>
                    <FontAwesomeIcon icon={faQrcode} />
                </IconButton>
            )}
        </Toolbar>
    );
};

export default WalletHeader;
