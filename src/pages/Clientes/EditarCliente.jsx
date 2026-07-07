import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);

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
        setEndereco(c.endereco || { cep: '', logradouro: '', bairro: '', cidade: '', uf: '', complemento: '' });
        setTelefones(c.telefones?.length > 0 ? c.telefones : [{ tipo: 'CELULAR', numero: '' }]);
        setEmails(c.emails?.length > 0 ? c.emails : [{ email: '' }]);
        
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        toast.error("Não foi possível carregar os dados do cliente.");
      }
    };
    buscarCliente();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSalvando(true);

    const payload = {
      nome: nome,
      cpf: cpf.replace(/\D/g, ''),
      endereco: { ...endereco, cep: endereco.cep?.replace(/\D/g, '') },
      telefones: telefones.map(t => ({ tipo: t.tipo, numero: t.numero.replace(/\D/g, '') })),
      emails: emails
    };

    try {
      await api.put(`/clientes/${id}`, payload);
      
      toast.success("Cliente atualizado com sucesso!");
      navigate('/clientes');
      
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error('Erro ao atualizar cliente. Verifique os dados.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="clientes-container">
      <h1>Editar Cliente</h1>
      <br />
      
      <form onSubmit={handleUpdate}>
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
          <label>CPF:</label>
          <input 
            type="text" 
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            required 
          />
        </div>

        <h3>Endereço</h3>
        <div>
          <label>CEP:</label>
          <input 
            type="text" 
            value={endereco.cep} 
            onChange={(e) => setEndereco({...endereco, cep: e.target.value})} 
          />
        </div>
        
        <div>
          <label>Logradouro:</label>
          <input 
            type="text" 
            value={endereco.logradouro} 
            onChange={(e) => setEndereco({...endereco, logradouro: e.target.value})} 
          />
        </div>
        
        <div>
          <label>Bairro:</label>
          <input 
            type="text" 
            value={endereco.bairro} 
            onChange={(e) => setEndereco({...endereco, bairro: e.target.value})} 
          />
        </div>
        
        <div>
          <label>Cidade:</label>
          <input 
            type="text" 
            value={endereco.cidade} 
            onChange={(e) => setEndereco({...endereco, cidade: e.target.value})} 
          />
        </div>
        
        <div>
          <label>UF:</label>
          <input 
            type="text" 
            value={endereco.uf} 
            onChange={(e) => setEndereco({...endereco, uf: e.target.value})} 
            maxLength="2"
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" className="btn-salvar" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button type="button" className="btn-cancelar" onClick={() => navigate('/clientes')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarCliente;