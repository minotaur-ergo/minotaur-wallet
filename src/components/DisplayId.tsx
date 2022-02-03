import React from 'react';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    truncate: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
    },
    addressEnd: {
        float: 'right',
        display: 'block',
    },
}));

const DisplayId = (props: { id: string | undefined}) => {
    const idStart = props.id ? props.id.substr(0, props.id.length - 10) : '';
    const idEnd = props.id ? props.id.substr(props.id.length - 10) : '';
    const classes = useStyles();
    return (
        <React.Fragment>
            <span className={classes.addressEnd}>{idEnd}&nbsp;&nbsp;</span>
            <span className={classes.truncate}>{idStart}</span>
        </React.Fragment>
    );
};

export default DisplayId;
