import { useState, useEffect } from 'react';
import api from '../../services/api';
import './Clientes.css'; // Vamos criar esse CSS no próximo passo

function Clientes() {
  // Estados da nossa tela
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

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

  return (
    <div className="clientes-container">
      <header className="clientes-header">
        <h1>👥 Painel de Clientes</h1>
        <button className="btn-novo">Novo Cliente</button>
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
              // Fazendo um loop (map) na lista de clientes que veio do Java
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf}</td>
                  {/* Como o endereço vem como um objeto, acessamos assim: */}
                  <td>{cliente.endereco.cidade} / {cliente.endereco.uf}</td>
                  <td>
                    <button className="btn-editar">Editar</button>
                    <button className="btn-excluir">Excluir</button>
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

export default Clientes;