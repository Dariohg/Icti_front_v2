import React from 'react';
import '../Styles/home.css';
import { useEffect } from 'react';

const Home = () => {
    useEffect(() => {
        console.log(document.cookie); // Muestra todas las cookies disponibles
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <h2>Bienvenido al Home</h2>
            <p>Esta es la página principal de la aplicación.</p>
        </div>
    );
};

export default Home;
