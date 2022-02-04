import React from "react";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";


const useStyles = makeStyles((theme: any) => ({
    grid: {
        minHeight: theme.height * 3
    },
    chip: {
        margin: 5
    },
    hideChip: {
        opacity: 0,
        margin: 5
    }
}));

interface PropsType {
    mnemonic: string;
    hideIndex?: Array<number>;
    handleClick?: (index: number) => any
}

const MnemonicView = (props: PropsType) => {
    const classes = useStyles();
    const mnemonicList = props.mnemonic ? props.mnemonic.split(" ") : [];
    const handleClick = (index: number) => {
        if (props.handleClick) {
            props.handleClick(index);
        }
    };
    const hideIndex = props.hideIndex ? props.hideIndex : []
    return (
        <Grid item xs={12} className={classes.grid}>
            {
                mnemonicList.map(
                    (item, index) => (
                        <Chip
                            key={index}
                            onClick={() => hideIndex.indexOf(index) < 0 ? handleClick(index) : null}
                            label={item}
                            className={hideIndex.indexOf(index) >= 0 ? classes.hideChip : classes.chip}
                        />
                    )
                )
            }
        </Grid>
    );
};

export default MnemonicView;
