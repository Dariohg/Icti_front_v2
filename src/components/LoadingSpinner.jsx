import React from 'react';
import { Spin } from 'antd';
import '../Styles/loadingSpinner.css';

const LoadingSpinner = () => {
    return (
        <div className="spin-container">
            <div className="spin">
                <Spin size="large" />
            </div>
        </div>
    );
};

export default LoadingSpinner;
