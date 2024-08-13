import React from 'react';
import '../Styles/Cube.css'; // Asegúrate de que esta hoja de estilos esté enlazada

const Cube = () => {
    return (
        <div className="scene">
            <div className="cube">
                <div className="face front">1</div>
                <div className="face back">2</div>
                <div className="face left">3</div>
                <div className="face right">4</div>
                <div className="face top">5</div>
                <div className="face bottom">6</div>
            </div>
        </div>
    );
}

export default Cube;
