import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Clientes from './pages/Clientes/Clientes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz (Login) */}
        <Route path="/" element={<Login />} />
        
        {/* Rota protegida (Painel de Clientes) */}
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;