import React from "react";
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


interface DAppConnectorHeaderPropsType {
    openQrCode: () => any;
}
const DAppConnectorHeader = (props: DAppConnectorHeaderPropsType) => {
    const navigate = useNavigate()
    return (
        <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => navigate(-1)}>
                <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{flexGrow: 1}}> Connect to DApps </Typography>
            <IconButton color="inherit" onClick={props.openQrCode}>
                <FontAwesomeIcon icon={faQrcode} />
            </IconButton>
        </Toolbar>
    );
};

export default DAppConnectorHeader;
