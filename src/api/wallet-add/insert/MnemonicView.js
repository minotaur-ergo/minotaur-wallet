import React from "react";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    grid: {
        minHeight: theme.height * 3
    },
    chip: {
        margin: 5,
    }
}))
const MnemonicView = props => {
    const classes = useStyles();
    const mnemonicList = props.mnemonic ? props.mnemonic.split(' ') : [];
    const handleItemClick = (index) => {
        if (props.handleClick) {
            props.handleClick(index)
        }
    }
    return (
        <Grid item xs={12} className={classes.grid}>
            {mnemonicList.map((item, index) => <Chip key={index} onClick={() => handleItemClick(index)} label={item}
                                                     className={classes.chip}/>)}
        </Grid>
    )
}

export default MnemonicView
