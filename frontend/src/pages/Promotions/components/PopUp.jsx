import React from 'react';

function PopUp(props) {
    return props.trigger ? (
        <div className="popup">
            <div className="popup-inner">
                <h1>CREATE PROMOTION</h1>
                <button className="close-btn" onClick={() => props.setTrigger(false)}>Close</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default PopUp;