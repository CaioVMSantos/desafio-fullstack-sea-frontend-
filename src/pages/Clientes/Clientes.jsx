import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import './Clientes.css';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  const valorGuardado = localStorage.getItem('role');
  console.log("O que está guardado na chave 'role':", valorGuardado);

  const isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        toast.error('Erro ao buscar os clientes. Verifique se o backend está rodando.');
      } finally {
        setCarregando(false);
      }
    };

    buscarClientes();
  }, []);

  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você está prestes a excluir este cliente. Esta ação não pode ser desfeita!",
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
        await api.delete(`/clientes/${id}`);
        
        setClientes(clientes.filter(c => c.id !== id));
        
        toast.success("Cliente excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir:", error);
        const msg = error.response?.data?.message || "Erro ao excluir. Verifique as permissões (admin apenas).";
        
        toast.error(msg);
      }
    }
  };

  return (
    <div className="clientes-container">
      <header className="clientes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1> Painel de Clientes</h1>
        
        {isAdmin && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-novo" onClick={() => navigate('/clientes/novo')}> 
              Novo Cliente 
            </button>
            
            <button 
              className="btn-novo" 
              onClick={() => navigate('/usuarios')}
            > 
              Gerenciar Usuários
            </button>
          </div>
        )}
      </header>

      {carregando && <p className="mensagem-carregando">Carregando dados...</p>}

      {!carregando && (
        <table className="clientes-tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Cidade/UF</th>
              {isAdmin && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center' }}>
                  Nenhum cliente cadastrado.
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nome}</td>
                  <td>{formatarCPF(cliente.cpf)}</td>
                  <td>{cliente.endereco?.cidade} / {cliente.endereco?.uf}</td>
                  
                  {isAdmin && (
                    <td>
                      <button 
                        className="btn-editar" 
                        onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-excluir" 
                        onClick={() => handleDelete(cliente.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Clientes;