import React from 'react';
import { FloatButton } from 'antd';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const FloatButtonGroup = () => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ right: 24, bottom: 24 }}
            icon={<PlusOutlined />}
        >
            <FloatButton
                icon={<UserAddOutlined />}
                onClick={handleRegisterClick}
            />
        </FloatButton.Group>
    );
};

export default FloatButtonGroup;
