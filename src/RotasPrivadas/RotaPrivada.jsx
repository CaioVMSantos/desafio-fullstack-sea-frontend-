import { Navigate } from 'react-router-dom';

function RotaPrivada({ children, exigeAdmin }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (exigeAdmin && role !== 'ROLE_ADMIN') {
    alert("Acesso negado: Área restrita para Administradores.");
    return <Navigate to="/clientes" replace />;
  }

  return children;
}

export default RotaPrivada;