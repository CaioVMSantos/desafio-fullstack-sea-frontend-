import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../Clientes/Clientes.css'; 

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setErro('Erro ao carregar a lista de usuários.');
      } finally {
        setCarregando(false);
      }
    };

    buscarUsuarios();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Atenção: Tem certeza que deseja excluir este usuário do sistema?")) {
      try {
        const response = await api.delete(`/usuarios/${id}`);
        
        setUsuarios(usuarios.filter(u => u.id !== id));
        
        alert(response.data); 
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert(error.response?.data || "Erro ao excluir usuário.");
      }
    }
  };

  return (
    <div className="clientes-container">
      <header className="clientes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🛡️ Gerenciar Usuários</h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Removido o style inline para assumir o azul ciano padrão do btn-novo */}
          <button 
            className="btn-novo" 
            onClick={() => navigate('/usuarios/novo')} 
          > 
            Novo Usuário 
          </button>
          
          {/* Classe alterada para btn-cancelar (botão vazado) e style inline removido */}
          <button 
            className="btn-cancelar" 
            onClick={() => navigate('/clientes')}
          > 
            Voltar a Clientes
          </button>
        </div>
      </header>

      {erro && <p className="mensagem-erro">{erro}</p>}
      {carregando && <p className="mensagem-carregando">Carregando dados...</p>}

      {!carregando && !erro && (
        <table className="clientes-tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>E-mail (Login)</th>
              <th>Nível de Acesso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum usuário cadastrado.</td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.login}</td>
                  <td>
                    {usuario.perfil === 'ROLE_ADMIN' ? 'Administrador' : 'Usuário Padrão'}
                  </td>
                  <td>
                    <button 
                      className="btn-excluir" 
                      onClick={() => handleDelete(usuario.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Usuarios;