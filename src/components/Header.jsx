import { useNavigate } from 'react-router-dom';
import logoSea from '../assets/sea-logo.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="global-header">
      <img 
        src={logoSea} 
        alt="Logo Sea Tecnologia" 
        className="logo-home-btn"
        onClick={() => navigate('/clientes')}
        title="Voltar para o Painel Inicial"
      />
    </header>
  );
}

export default Header;