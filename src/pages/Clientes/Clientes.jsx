import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Clientes.css'; // Vamos criar esse CSS no próximo passo

function Clientes() {
  // Estados da nossa tela
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // O useEffect roda automaticamente quando a tela é carregada
  useEffect(() => {
    // 1. Declaramos a função DENTRO do useEffect
    const buscarClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error(error);
        setErro('Erro ao buscar os clientes. Verifique se o backend está rodando.');
      } finally {
        setCarregando(false);
      }
    };

    buscarClientes();
  }, []);

  // Formatar CPF para exibir na tabela (000.000.000-00)
  const formatarCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para deletar cliente
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        setClientes(clientes.filter(c => c.id !== id));
      } catch (error) {
        console.error(error);
        alert("Erro ao excluir o cliente.");
      }
    }
  };

  return (
    <div className="clientes-container">
      <header className="clientes-header">
        <h1>👥 Painel de Clientes</h1>
        <button className="btn-novo" onClick={() => navigate('/clientes/novo')}> Novo Cliente </button>
      </header>

      {/* Mensagens de feedback */}
      {erro && <p className="mensagem-erro">{erro}</p>}
      {carregando && <p className="mensagem-carregando">Carregando dados...</p>}

      {/* Tabela de Dados */}
      {!carregando && !erro && (
        <table className="clientes-tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Cidade/UF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
  {clientes.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: 'center' }}>Nenhum cliente cadastrado.</td>
    </tr>
  ) : (
    clientes.map((cliente) => {
      // DEBUG: Isso vai aparecer no seu Console (F12)
      console.log("Objeto cliente recebido:", cliente); 
      
      return (
        <tr key={cliente.id}>
          <td>{cliente.id}</td>
          <td>{cliente.nome}</td>
          <td>{formatarCPF(cliente.cpf)}</td>
          <td>{cliente.endereco?.cidade} / {cliente.endereco?.uf}</td>
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
        </tr>
      );
    })
  )}
</tbody>
        </table>
      )}
    </div>
  );
}

export default Clientes;