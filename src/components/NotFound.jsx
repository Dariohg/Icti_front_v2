import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="404"
            title="404"
            subTitle="Lo siento, la página que visitaste no existe."
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    Volver al Inicio
                </Button>
            }
        />
    );
};

export default NotFound;
