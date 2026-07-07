import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ajuste o caminho se necessário

function NovoUsuario() {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  
  // Estados do formulário
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('ROLE_USER'); // Deixamos o Padrão como default

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    const payload = {
      login: login,
      senha: senha,
      perfil: perfil
    };

    try {
      // Chama a sua rota de registro que já testamos no Postman
      await api.post('/auth/registrar', payload);
      alert('Usuário cadastrado com sucesso!');
      
      // Limpa os campos após o sucesso para facilitar um novo cadastro
      setLogin('');
      setSenha('');
      setPerfil('ROLE_USER');
      
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
      if (err.response && err.response.data) {
        setErro(typeof err.response.data === 'string' ? err.response.data : 'Erro ao cadastrar.');
      } else {
        setErro('Erro de conexão com o servidor.');
      }
    }
  };

  return (
    <div className="usuarios-container">
      <h2>🛡️ Cadastrar Novo Usuário (Admin)</h2>
      
      {erro && <p className="mensagem-erro" style={{ color: 'red' }}>{erro}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>E-mail (Login):</label>
          <input 
            type="email" 
            value={login} 
            onChange={(e) => setLogin(e.target.value)} 
            required 
            placeholder="email@empresa.com"
          />
        </div>

        <div>
          <label>Senha:</label>
          <input 
            type="password" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Nível de Acesso:</label>
          <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
            <option value="ROLE_USER">Usuário Padrão (Apenas Leitura)</option>
            <option value="ROLE_ADMIN">Administrador (Acesso Total)</option>
          </select>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn-salvar">Criar Usuário</button>
          <button type="button" className="btn-cancelar" onClick={() => navigate('/clientes')}>
            Voltar ao Painel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NovoUsuario;