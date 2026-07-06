import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importação crucial para mudar de página
import api from '../../services/api';
import './Login.css';

function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  
  const navigate = useNavigate(); // Inicialização do navegador do React

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      // Faz o POST para o teu Spring Boot
      const response = await api.post('/auth/login', { 
        login: login, 
        senha: senha 
      });

      // Pega no token exato que vimos no teu print
      const token = response.data.token; 
      
      // Guarda no cofre do browser
      localStorage.setItem('token', token);
      
      // Redireciona para a tabela de clientes!
      navigate('/clientes');
      
    } catch (error) {
      console.error("Erro no login:", error);
      setErro('Credenciais inválidas ou erro de ligação com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Acesso Restrito</h2>
        
        {erro && <p className="error-message">{erro}</p>}
        
        <div className="input-group">
          <label>Utilizador:</label>
          <input 
            type="text" 
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Digita o teu login"
            required 
          />
        </div>

        <div className="input-group">
          <label>Senha:</label>
          <input 
            type="password" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digita a tua senha"
            required 
          />
        </div>

        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
}

export default Login;