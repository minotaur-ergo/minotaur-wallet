import React from 'react';
import Moment from 'react-moment';

interface PropsType {
    timestamp: number;
    showTime?: boolean;
}

const DateView = (props: PropsType) => {
    const date = '' + new Date(props.timestamp);
    return (
        <span style={{ float: 'right', display: 'block' }}>
            <Moment format='YYYY/MM/DD'>
                {date}
            </Moment>
            <br/>
            {props.showTime ? (
                <Moment format='HH:mm:ss'>
                    {date}
                </Moment>
            ) : null}
        </span>
    );
};

export default DateView;
