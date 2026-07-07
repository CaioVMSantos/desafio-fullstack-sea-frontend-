import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function NovoCliente() {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [complemento, setComplemento] = useState('');
  const [numeroTelefone, setNumeroTelefone] = useState('');
  const [tipoTelefone, setTipoTelefone] = useState('CELULAR'); // Padrão: CELULAR, RESIDENCIAL, COMERCIAL
  const [emailContato, setEmailContato] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    const payload = {
      nome: nome,
      cpf: cpf,
      endereco: {
        cep: cep,
        logradouro: logradouro,
        bairro: bairro,
        cidade: cidade,
        uf: uf,
        complemento: complemento || null 
      },
      telefones: [
        {
          numero: numeroTelefone,
          tipo: tipoTelefone
        }
      ],
      emails: [
        {
          email: emailContato
        }
      ]
    };

    try {
      await api.post('/clientes', payload);
      alert('Cliente cadastrado com sucesso!');
      navigate('/clientes'); 
    } catch (err) {
      console.error("Erro na requisição:", err);
      if (err.response && err.response.data) {
        setErro(typeof err.response.data === 'string' ? err.response.data : 'Erro de validação nos campos.');
      } else {
        setErro('Erro ao conectar com o servidor.');
      }
    }
  };

  return (
    <div className="clientes-container">
      <h2>👥 Cadastrar Novo Cliente</h2>
      
      {erro && <p className="mensagem-erro" style={{ color: 'red' }}>{erro}</p>}

      <form onSubmit={handleSubmit}>
        <h3>Informações Pessoais</h3>
        <div>
          <label>Nome Completo:</label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>CPF (apenas números):</label>
          <input 
            type="text" 
            maxLength="11"
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            required 
          />
        </div>

        <h3>Endereço</h3>
        <div>
          <label>CEP (apenas números):</label>
          <input 
            type="text" 
            maxLength="8"
            value={cep} 
            onChange={(e) => setCep(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Endereço (Rua, Av, etc.):</label>
          <input 
            type="text" 
            value={logradouro} 
            onChange={(e) => setLogradouro(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Bairro:</label>
          <input 
            type="text" 
            value={bairro} 
            onChange={(e) => setBairro(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Cidade:</label>
          <input 
            type="text" 
            value={cidade} 
            onChange={(e) => setCidade(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>UF:</label>
          <input 
            type="text" 
            maxLength="2"
            value={uf} 
            onChange={(e) => setUf(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Complemento (Opcional):</label>
          <input 
            type="text" 
            value={complemento} 
            onChange={(e) => setComplemento(e.target.value)} 
          />
        </div>

        <h3>Contatos Iniciais</h3>
        <div>
          <label>Telefone:</label>
          <input 
            type="text" 
            maxLength="11"
            value={numeroTelefone} 
            onChange={(e) => setNumeroTelefone(e.target.value)} 
            required 
          />
          <select value={tipoTelefone} onChange={(e) => setTipoTelefone(e.target.value)}>
            <option value="CELULAR">Celular</option>
            <option value="RESIDENCIAL">Residencial</option>
            <option value="COMERCIAL">Comercial</option>
          </select>
        </div>

        <div>
          <label>E-mail de Contato:</label>
          <input 
            type="email" 
            value={emailContato} 
            onChange={(e) => setEmailContato(e.target.value)} 
            required 
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn-salvar">Salvar Cliente</button>
          <button type="button" className="btn-cancelar" onClick={() => navigate('/clientes')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default NovoCliente;