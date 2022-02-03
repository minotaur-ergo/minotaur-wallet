import React from 'react';
import { makeStyles } from '@material-ui/core';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DisplayId from './DisplayId';
import { show_notification } from "../utils/utils";

interface PropsType {
    address?: string;
}

const useStyles = makeStyles(theme => ({
    floatRight: {
        float: 'right'
    }
}))

const CopyableAddress = (props: PropsType) => {
    const classes = useStyles();
    const copyText = () => {
        show_notification("Copied!!");
    }
    return (
        <>
            <CopyToClipboard text={props.address ? props.address : ""} onCopy={copyText}>
                <FontAwesomeIcon className={classes.floatRight} icon={faCopy} />
            </CopyToClipboard>
            <DisplayId id={props.address}/>
        </>
    )
}

export default CopyableAddress
