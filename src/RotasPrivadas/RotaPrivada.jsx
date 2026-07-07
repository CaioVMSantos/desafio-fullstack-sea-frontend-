import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header.jsx'; 

function RotaPrivada({ children, exigeAdmin }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (exigeAdmin && role !== 'ROLE_ADMIN') {
    toast.error("Acesso negado: Área restrita para Administradores.");
    return <Navigate to="/clientes" replace />;
  }

  return (
    <>
      <Header />
      
      <div style={{ paddingTop: '100px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        {children}
      </div>
    </>
  );
}

export default RotaPrivada;