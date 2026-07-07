import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Clientes from './pages/Clientes/Clientes';
import NovoCliente from './pages/Clientes/NovoCliente';
import EditarCliente from './pages/Clientes/EditarCliente';
import Usuarios from './pages/Usuario/Usuarios';
import NovoUsuario from './pages/Usuario/NovoUsuario';
import { Toaster } from 'react-hot-toast';

import RotaPrivada from './RotasPrivadas/RotaPrivada.jsx';

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        containerStyle={{
          zIndex: 99999,
        }}
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(16px)', 
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff', 
            fontFamily: "'Poppins', sans-serif", 
          },
          success: {
            iconTheme: {
              primary: '#00a3e0',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#ffffff',
            },
          },
        }}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/clientes" element={
            <RotaPrivada>
              <Clientes />
            </RotaPrivada>
          } />
          
          <Route path="/clientes/novo" element={
            <RotaPrivada>
              <NovoCliente />
            </RotaPrivada>
          } />

          <Route path="/clientes/editar/:id" element={
            <RotaPrivada>
              <EditarCliente />
            </RotaPrivada>
          } />

          <Route path="/usuarios" element={
            <RotaPrivada exigeAdmin={true}>
              <Usuarios />
            </RotaPrivada>
          } />

          <Route path="/usuarios/novo" element={
            <RotaPrivada exigeAdmin={true}>
              <NovoUsuario />
            </RotaPrivada>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;