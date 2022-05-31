import React from 'react';
import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { NETWORK_TYPES } from '../../util/network_type';

interface PublishTypePropsType {
    publishType: PUBLISH_TYPES,
    setPublishType: (newType: PUBLISH_TYPES) => any
}

export enum PUBLISH_TYPES {
    cosigning,
    manual
}

const PublishType = (props: PublishTypePropsType) => {
    return (
        <Grid item xs={12} marginTop={2}>
            <ToggleButtonGroup
                color='primary'
                size='medium'
                style={{ width: '100%' }}
                value={props.publishType}
                exclusive
                onChange={(event, newType) => props.setPublishType(newType as PUBLISH_TYPES)}
            >
                <ToggleButton style={{ width: `${50}%` }} value={PUBLISH_TYPES.manual}>
                    Manual transafer
                </ToggleButton>
                <ToggleButton style={{ width: `${50}%` }} value={PUBLISH_TYPES.cosigning}>
                    Cosigning server
                </ToggleButton>
            </ToggleButtonGroup>
        </Grid>
    );
};

export default PublishType;