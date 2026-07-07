import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import '../Clientes/Clientes.css'; 

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error('Erro ao carregar a lista de usuários.');
      } finally {
        setCarregando(false);
      }
    };

    buscarUsuarios();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Atenção',
      text: "Tem certeza que deseja excluir este usuário do sistema? O acesso dele será revogado imediatamente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f87171', 
      cancelButtonColor: '#334155',  
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#ffffff',
    });

    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/usuarios/${id}`);
        
        setUsuarios(usuarios.filter(u => u.id !== id));
        
        toast.success(typeof response.data === 'string' ? response.data : "Usuário excluído com sucesso!"); 
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        toast.error(error.response?.data || "Erro ao excluir usuário.");
      }
    }
  };

  return (
    <div className="clientes-container">
      <header className="clientes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gerenciar Usuários</h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-novo" 
            onClick={() => navigate('/usuarios/novo')} 
          > 
            Novo Usuário 
          </button>
          
          <button 
            className="btn-cancelar" 
            onClick={() => navigate('/clientes')}
          > 
            Voltar a Clientes
          </button>
        </div>
      </header>

      {carregando && <p className="mensagem-carregando">Carregando dados...</p>}

      {!carregando && (
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