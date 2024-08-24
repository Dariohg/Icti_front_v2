import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Render from './Render';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Enlaces from './Pages/Enlaces';
import AddEnlace from './Pages/AddEnlace';
import ViewEnlace from './Pages/ViewEnlace';
import AddContrato from './Pages/AddContrato';
import Contratos from './Pages/Contratos';
import NotFound from "./components/NotFound";
import AddServicios from "./Pages/AddServicios";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="login" />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />


                <Route path="home" element={<Render><Home /></Render>} />
                <Route path="enlaces" element={<Render><Enlaces /></Render>} />
                <Route path="addEnlace" element={<Render><AddEnlace /></Render>} />
                <Route path="viewEnlace/:id" element={<Render><ViewEnlace /></Render>} />
                <Route path="contratos" element={<Render><Contratos /></Render>} />
                <Route path="addContrato" element={<Render><AddContrato /></Render>} />
                <Route path="addServicio" element={<Render><AddServicios/></Render>}/>

                <Route path="*" element={<NotFound />} /> {/* Ruta para páginas no encontradas */}
            </Routes>
        </Router>
    );
}

export default App;
