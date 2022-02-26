import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import TextInput from "../../../components/TextInput";

interface PropsType {
    name: string;
    goBack?: () => any;
    goForward: (name: string) => any;
    children: React.ReactElement;
}

const WalletName = (props: PropsType) => {
    const [name, setName] = useState(props.name);

    const validateName = () => {
        return (name === "") ? "Name must entered" : "";
    };
    const formValid = () => {
        return validateName() === "";
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {props.children}
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <TextInput
                    label="Wallet name"
                    error={validateName()}
                    value={name}
                    setValue={setName} />
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
                        onClick={() => props.goForward(name)}
                        disabled={!formValid()}>
                        Next
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );

};


export default WalletName;
