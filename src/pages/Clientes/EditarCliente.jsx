import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState({
    cep: '', logradouro: '', bairro: '', cidade: '', uf: '', complemento: ''
  });
  const [telefones, setTelefones] = useState([{ tipo: 'CELULAR', numero: '' }]);
  const [emails, setEmails] = useState([{ email: '' }]);

  useEffect(() => {
    const buscarCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        const c = response.data;
        setNome(c.nome);
        setCpf(c.cpf);
        setEndereco(c.endereco);
        setTelefones(c.telefones);
        setEmails(c.emails);
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        setErro("Não foi possível carregar os dados.");
      }
    };
    buscarCliente();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    const payload = {
      nome: nome,
      cpf: cpf.replace(/\D/g, ''),
      endereco: { ...endereco, cep: endereco.cep.replace(/\D/g, '') },
      telefones: telefones.map(t => ({ tipo: t.tipo, numero: t.numero.replace(/\D/g, '') })),
      emails: emails
    };

    try {
      await api.put(`/clientes/${id}`, payload);
      navigate('/clientes');
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setErro('Erro ao atualizar cliente.');
    } finally {
      setSalvando(false);
    }
  };

  const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px' };
  const cardStyle = { border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '5px' };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>✏️ Editar Cliente</h1>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      
      <form onSubmit={handleUpdate}>
        <fieldset style={cardStyle}>
          <legend><b>Dados Pessoais</b></legend>
          <label>Nome Completo</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} required />
          <label>CPF</label>
          <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} style={inputStyle} required />
        </fieldset>

        <fieldset style={cardStyle}>
          <legend><b>Endereço</b></legend>
          <label>CEP</label>
          <input type="text" value={endereco.cep} onChange={(e) => setEndereco({...endereco, cep: e.target.value})} style={inputStyle} />
          <label>Logradouro</label>
          <input type="text" value={endereco.logradouro} onChange={(e) => setEndereco({...endereco, logradouro: e.target.value})} style={inputStyle} />
          <label>Bairro</label>
          <input type="text" value={endereco.bairro} onChange={(e) => setEndereco({...endereco, bairro: e.target.value})} style={inputStyle} />
          <label>Cidade</label>
          <input type="text" value={endereco.cidade} onChange={(e) => setEndereco({...endereco, cidade: e.target.value})} style={inputStyle} />
          <label>UF</label>
          <input type="text" value={endereco.uf} onChange={(e) => setEndereco({...endereco, uf: e.target.value})} style={inputStyle} />
        </fieldset>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" disabled={salvando} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button type="button" onClick={() => navigate('/clientes')} style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarCliente;