import React, { useState } from "react";
import { Button, Container, Grid } from "@mui/material";
import TextInput from "../../../inputs/TextInput";

interface TotalSignPropsType {
    total: string;
    goBack?: () => any;
    goForward: (total: string) => any;
    children?: React.ReactNode;
}

const TotalSign = (props: TotalSignPropsType) => {
    const [total, setTotal] = useState(props.total);

    const validateTotal = () => {
        if (total === "") return "Total signers is required";
        if (isNaN(parseInt(total))) return "Invalid number entered";
        return parseInt(total) <= 1 ? "Total signers must be grater or equals to 2" : "";
    };
    const formValid = () => {
        return validateTotal() === "";
    };

    return (
        <Container>
            <Grid container columnSpacing={2} marginBottom={2}>
                <Grid item xs={12}>
                    {props.children}
                </Grid>
                <Grid item xs={12}>
                    <TextInput
                        label="Total Sign"
                        error={validateTotal()}
                        value={total}
                        setValue={setTotal} />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => props.goForward(total)}
                        disabled={!formValid()}>
                        Next
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );

};


export default TotalSign;
