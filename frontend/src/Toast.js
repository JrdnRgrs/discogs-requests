import React from 'react';
import './Toast.css'; // Import toast-specific styles

const Toast = ({ show, message, onClose }) => {
    return (
        <div className={`toast ${show ? 'toast-show' : ''}`}>
            {message}
            <button onClick={onClose} className="toast-close-btn">X</button>
        </div>
    );
}

export default Toast;
