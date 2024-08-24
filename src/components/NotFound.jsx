import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const NotFound = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        const cookie = Cookies.get('token');

        if (cookie) {
            navigate('/home'); // Redirige al home si hay una sesión iniciada
        } else {
            navigate('/login'); // Redirige al login si no hay sesión
        }
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle="Lo siento, la página que visitaste no existe."
            extra={
                <Button type="primary" onClick={handleRedirect}>
                    Volver al Inicio
                </Button>
            }
        />
    );
};

export default NotFound;
