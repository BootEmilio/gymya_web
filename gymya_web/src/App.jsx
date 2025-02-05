import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Importa Routes en lugar de Switch
import Principal from './pagina_principal/principal';
import InicioSesion from './inicio_sesion/inicio_sesion.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* La ruta raíz ("/") debe cargar Principal.jsx al inicio */}
        <Route path="/" element={<Principal />} />  
        {/* La ruta /login carga InicioSesion.jsx */}
        <Route path="/login" element={<InicioSesion />} /> 
      </Routes>
    </Router>
  );
}

export default App;
