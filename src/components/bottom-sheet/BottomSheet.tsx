import React from 'react';
import './BottomSheet.css';

export interface BottomSheetPropsType {
    show: boolean;
    children?: React.ReactNode;
    close: () => any;
}

const BottomSheet = (props: BottomSheetPropsType) => {
    return (
        <div className={props.show ? 'card-container' : 'card-container hide'}>
            <div className="overlay" onClick={props.close}/>
            <div className='card'>
                {props.children ? props.children : null}
            </div>
        </div>
    );
}


export default BottomSheet;
