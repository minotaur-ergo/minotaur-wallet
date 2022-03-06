import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import { Card, CardContent, createStyles, Fab } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            overflow: "visible"
        },
        row: {
            position: "relative",
        },
        zeroPadding: {
            padding: "0 !important"
        },
        fab: {
            position: "absolute",
            width: 25,
            height: 25,
            right: 2,
            top: -9,
            textAlign: "center",
            backgroundColor: "white"
        }
    })
);


interface PropsType {
    children?: React.ReactNode;
    showDelete?: boolean;
    delete: () => any;
}

const ReceiverRowCard = (props: PropsType) => {
    const classes = useStyles();
    return (
        <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.row}>
                {props.showDelete ? (
                    <div className={classes.fab} onClick={() => props.delete()}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                ) : null}
                {props.children}
            </CardContent>
            <CardContent className={classes.zeroPadding}/>
        </Card>
    );
};

export default ReceiverRowCard;
