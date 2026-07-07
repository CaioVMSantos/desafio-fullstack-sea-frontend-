import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Login.css';
import logoSea from '../../assets/sea-logo.png';

function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await api.post('/auth/login', {
        login: login,
        senha: senha
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      navigate('/clientes');
    } catch (error) {
      console.error("Erro no login:", error);
      setErro('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="banner-logo">
        <img src={logoSea} alt="Logo Sea Tecnologia" />
      </div>
      
      <div className="login-banner">
        <h1>Ficou Interessado?</h1>
        <p>Preencha o formulário, tire suas dúvidas e solicite sua consulta para acessar o sistema.</p>
      </div>

      <div className="login-form-area">
        <div className="login-form-content">
          <h2>Acessar Sistema</h2>
          <p>Insira suas credenciais corporativas.</p>

          {erro && <div className="mensagem-erro">{erro}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>E-mail *</label>
              <input 
                type="email" 
                placeholder="usuario@sea.com" 
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <label>Senha *</label>
              <div className="input-wrapper">
                <input 
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="••••••••" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required 
                />
                
                <button 
                  type="button" 
                  className="btn-eye" 
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  tabIndex="-1" 
                >
                  {mostrarSenha ? (
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login">ENTRAR</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;