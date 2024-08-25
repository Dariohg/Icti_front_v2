import React, { useEffect } from 'react';
import CardServicios from '../components/CardServicios'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import '../Styles/home.css';

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
