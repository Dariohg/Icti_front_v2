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
import ViewContrato from "./Pages/ViewContrato";
import Usuarios from "./Pages/Usuarios";
import Servicios from "./Pages/Servicios";
import AllContratos from "./Pages/AllContratos";
import ViewAllContrato from "./Pages/ViewAllContrato";

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
                <Route path="viewContrato/:id" element={<Render><ViewContrato/></Render>}/>
                <Route path="usuarios" element={<Render><Usuarios/></Render>}/>
                <Route path="servicios" element={<Render><Servicios/></Render>}/>

                <Route path="allContratos" element={<Render><AllContratos/></Render>}/>
                <Route path="viewAllContrato/:id" element={<Render><ViewAllContrato/></Render>}/>

                <Route path="*" element={<NotFound />} /> {/* Ruta para páginas no encontradas */}
            </Routes>
        </Router>
    );
}

export default App;
