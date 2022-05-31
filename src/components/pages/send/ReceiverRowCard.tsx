import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Card, CardContent } from "@mui/material";


// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         card: {
//             overflow: "visible"
//         },
//         row: {
//             position: "relative",
//         },
//         zeroPadding: {
//             padding: "0 !important"
//         },
//         fab: {
//             position: "absolute",
//             width: 25,
//             height: 25,
//             right: 2,
//             top: -9,
//             textAlign: "center",
//             backgroundColor: "white"
//         }
//     })
// );


interface PropsType {
    children?: React.ReactNode;
    showDelete?: boolean;
    delete: () => any;
}

const ReceiverRowCard = (props: PropsType) => {
    // const classes = useStyles();
    return (
        <Card variant="outlined">
            <CardContent>
                {props.showDelete ? (
                    <div onClick={() => props.delete()}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                ) : null}
                {props.children}
            </CardContent>
            {/*<CardContent/>*/}
        </Card>
    );
};

export default ReceiverRowCard;
