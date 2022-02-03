import React from 'react';

/**
 * Animations
 */

import './BottomSheet.css';

interface PropsType {
    show: boolean;
    children?: React.ReactNode;
    close: () => any;
}


const BottomSheet = (props: PropsType) => {
    return (
        <div className={props.show ? 'card-container' : 'card-container hide'}>
            <div className="overlay" onClick={props.close}/>
            <div className='content'>
                {props.children ? props.children : null}
            </div>
        </div>
    );
}


export default BottomSheet;
