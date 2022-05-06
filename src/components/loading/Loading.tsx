import React from 'react';
import ReactLoading from "react-loading";

const Loading = () => {
    return (
        <div style={{ padding: "0 50%", marginLeft: "-50px" }}>
            <ReactLoading type="bars" color="#000" width="100px" height="100px" />
        </div>
    )
}

export default Loading;
