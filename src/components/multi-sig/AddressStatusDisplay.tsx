import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons';

interface AddressStatusDisplayPropsType {
    commitment: boolean;
    sign: boolean;
}

const AddressStatusDisplay = (props: AddressStatusDisplayPropsType) => {
    const getIcon = (state: boolean) => state ? faCheck : faBan;
    const getColor = (state: boolean) => state ? "green" : "";
    return (
        <span style={{color: getColor(props.commitment), width: "50%", display:"inline-block"}}>
            <FontAwesomeIcon icon={getIcon(props.commitment)} />
            &nbsp;&nbsp;Commitment
        </span>
    );
};

export default AddressStatusDisplay;