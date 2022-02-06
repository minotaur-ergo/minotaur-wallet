import React, { useState } from "react";
import { QRCODE_SIZE_DEFAULT } from "../config/const";
import { Button, Grid, Slider } from "@material-ui/core";
import QrCode from "qrcode.react";

interface PropsType {
    requestType: string;
    requestData: string;
}

const RequestQrcodeDisplay = (props: PropsType) => {
    const [chunkSize, setChunkSize] = useState(QRCODE_SIZE_DEFAULT);
    const [chunk, setChunk] = useState(0);
    const chunks = Math.ceil((props.requestData.length) / chunkSize);
    const req = chunks === 1 ? `${props.requestType}-${props.requestData}` :
        `${props.requestType}/${chunk + 1}/${chunks}-` + props.requestData.substr(chunk * chunkSize, chunkSize);
    const gotoNext = () => {
        if (chunk < chunks - 1) {
            setChunk(chunk + 1);
        }
    };

    const gotoPrev = () => {
        if (chunk > 0) {
            setChunk(chunk - 1);
        }
    };
    const setNewChunkSize = (newValue: number | Array<number>) => {
        setChunkSize(typeof newValue === "number" ? newValue : newValue[0]);
        setChunk(0);
    };
    return (
        <React.Fragment>
            <Grid item xs={12}>
                <QrCode value={req} size={256} />
            </Grid>
            {chunks > 1 ? (
                <React.Fragment>
                    <Grid item xs={12}>
                        {chunk + 1} / {chunks}
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={gotoPrev}
                            color={chunk === 0 ? "default" : "primary"}>
                            Prev
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={gotoNext}
                            color={chunk >= chunks - 1 ? "default" : "primary"}>
                            Next
                        </Button>
                    </Grid>
                </React.Fragment>
            ) : null}
            <React.Fragment>
                <div>If your qrcode scanner can not scan qrcode, you can make bigger size qrcode.</div>
                <Slider
                    defaultValue={QRCODE_SIZE_DEFAULT}
                    onChange={(event, newValue) => setNewChunkSize(newValue)}
                    step={100}
                    marks
                    min={200}
                    max={Math.min(3000, props.requestData.length)}
                />
            </React.Fragment>
        </React.Fragment>
    );
};

export default RequestQrcodeDisplay;
