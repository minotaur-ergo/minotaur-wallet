import React from 'react'


const erg = props => {
    const value = props.value === undefined ? 0 : props.value / 1e9;
    let unit = '';
    if(props.showUnit) unit = ' erg'
    return (
        <div className={props.class}>{value}{unit}</div>
    )
}

export default erg
