import React from 'react';
import { SnackbarKey, useSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import { Close } from '@mui/icons-material'

interface CloseSnackbarProps {
    msgKey: SnackbarKey;
}


const CloseButton: React.FC<CloseSnackbarProps> = ({msgKey}) => {
    const {closeSnackbar} = useSnackbar();
    return (
        <IconButton
            aria-label="Close notification"
            color="inherit"
            onClick={() => closeSnackbar(msgKey)}
        >
            <Close fontSize="small"/>
        </IconButton>
    );
};

export default CloseButton;