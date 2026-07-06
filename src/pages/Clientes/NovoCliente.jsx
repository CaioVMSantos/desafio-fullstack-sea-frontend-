import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Usaremos axios direto para o ViaCEP (API externa)
import api from '../../services/api'; // Sua API autenticada com Spring Boot

function NovoCliente() {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Estados Base
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');

  // Estado do Endereço
  const [endereco, setEndereco] = useState({
    cep: '', logradouro: '', bairro: '', cidade: '', uf: '', complemento: ''
  });

  // Estados Dinâmicos (Arrays) - Começam com 1 item em branco
  const [telefones, setTelefones] = useState([{ tipo: 'CELULAR', numero: '' }]);
  const [emails, setEmails] = useState([{ email: '' }]);

  // ===================== MÁSCARAS =====================
  const formatarCPF = (valor) => {
    return valor
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1'); // Limita a 14 caracteres
  };

  const formatarCEP = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1'); // Limita a 9 caracteres
  };

  const formatarTelefone = (valor, tipo) => {
    let v = valor.replace(/\D/g, '');
    if (tipo === 'CELULAR') {
      // Máscara com 9 dígitos: (99) 99999-9999
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d)(\d{4})$/, '$1-$2');
      return v.substring(0, 15);
    } else {
      // Máscara com 8 dígitos (Residencial/Comercial): (99) 9999-9999
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d)(\d{4})$/, '$1-$2');
      return v.substring(0, 14);
    }
  };

  // ===================== VIACEP =====================
  const buscarCep = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (!response.data.erro) {
          setEndereco(prev => ({
            ...prev,
            logradouro: response.data.logradouro,
            bairro: response.data.bairro,
            cidade: response.data.localidade,
            uf: response.data.uf
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleCepChange = (e) => {
    const novoCep = formatarCEP(e.target.value);
    setEndereco({ ...endereco, cep: novoCep });
    if (novoCep.length === 9) buscarCep(novoCep);
  };

  // ===================== ARRAYS DINÂMICOS =====================
  const adicionarTelefone = () => setTelefones([...telefones, { tipo: 'CELULAR', numero: '' }]);
  const removerTelefone = (index) => setTelefones(telefones.filter((_, i) => i !== index));
  const atualizarTelefone = (index, campo, valor) => {
    const novosTelefones = [...telefones];
    novosTelefones[index][campo] = campo === 'numero' 
      ? formatarTelefone(valor, novosTelefones[index].tipo) 
      : valor;
    
    // Recalcular máscara se mudar o tipo
    if (campo === 'tipo') {
      novosTelefones[index].numero = formatarTelefone(novosTelefones[index].numero, valor);
    }
    setTelefones(novosTelefones);
  };

  const adicionarEmail = () => setEmails([...emails, { email: '' }]);
  const removerEmail = (index) => setEmails(emails.filter((_, i) => i !== index));
  const atualizarEmail = (index, valor) => {
    const novosEmails = [...emails];
    novosEmails[index].email = valor;
    setEmails(novosEmails);
  };

  // ===================== SUBMIT =====================
  const handleSalvar = async (e) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    // 1. O Desafio exige enviar TUDO SEM MÁSCARA para o banco
    const payload = {
      nome: nome,
      cpf: cpf.replace(/\D/g, ''),
      endereco: {
        ...endereco,
        cep: endereco.cep.replace(/\D/g, '')
      },
      telefones: telefones.map(t => ({
        tipo: t.tipo,
        numero: t.numero.replace(/\D/g, '')
      })),
      emails: emails
    };

    try {
      await api.post('/clientes', payload);
      navigate('/clientes'); // Sucesso! Volta pra tabela.
    } catch (error) {
      console.error("Erro no cadastro:", error);
      // Pega a mensagem de erro que o Spring Boot (Anotação @Valid) enviou
      if (error.response && error.response.data && error.response.data.message) {
         setErro(`Erro: ${error.response.data.message}`);
      } else {
         setErro('Erro de validação. Verifique os dados informados.');
      }
    } finally {
      setSalvando(false);
    }
  };

  // ===================== ESTILOS BÁSICOS =====================
  const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px' };
  const rowStyle = { display: 'flex', gap: '10px' };
  const cardStyle = { border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '5px' };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>➕ Novo Cliente</h1>
      {erro && <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee', border: '1px solid red', marginBottom: '15px' }}>{erro}</div>}
      
      <form onSubmit={handleSalvar}>
        
        {/* DADOS PESSOAIS */}
        <fieldset style={cardStyle}>
          <legend><b>Dados Pessoais</b></legend>
          <div style={rowStyle}>
            <div style={{ flex: 2 }}>
              <label>Nome Completo *</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required minLength="3" maxLength="100" style={inputStyle} placeholder="Somente letras e números" pattern="[a-zA-ZÀ-ÿ0-9\s]+" title="Apenas letras, números, acentos e espaços" /></div>
            <div style={{ flex: 1 }}>
              <label>CPF *</label>
              <input type="text" value={cpf} onChange={(e) => setCpf(formatarCPF(e.target.value))} required style={inputStyle} placeholder="000.000.000-00" />
            </div>
          </div>
        </fieldset>

        {/* ENDEREÇO */}
        <fieldset style={cardStyle}>
          <legend><b>Endereço</b></legend>
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label>CEP *</label>
              <input type="text" value={endereco.cep} onChange={handleCepChange} required style={inputStyle} placeholder="00000-000" />
            </div>
            <div style={{ flex: 3 }}>
              <label>Logradouro *</label>
              <input type="text" value={endereco.logradouro} onChange={(e) => setEndereco({...endereco, logradouro: e.target.value})} required style={inputStyle} />
            </div>
          </div>
          <div style={rowStyle}>
            <div style={{ flex: 2 }}>
              <label>Bairro *</label>
              <input type="text" value={endereco.bairro} onChange={(e) => setEndereco({...endereco, bairro: e.target.value})} required style={inputStyle} />
            </div>
            <div style={{ flex: 2 }}>
              <label>Cidade *</label>
              <input type="text" value={endereco.cidade} onChange={(e) => setEndereco({...endereco, cidade: e.target.value})} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label>UF *</label>
              <input type="text" value={endereco.uf} onChange={(e) => setEndereco({...endereco, uf: e.target.value})} required maxLength="2" style={inputStyle} />
            </div>
          </div>
          <div>
            <label>Complemento (Opcional)</label>
            <input type="text" value={endereco.complemento} onChange={(e) => setEndereco({...endereco, complemento: e.target.value})} style={inputStyle} />
          </div>
        </fieldset>

        {/* TELEFONES */}
        <fieldset style={cardStyle}>
          <legend><b>Telefones</b></legend>
          {telefones.map((tel, index) => (
            <div key={index} style={{ ...rowStyle, alignItems: 'center' }}>
              <select value={tel.tipo} onChange={(e) => atualizarTelefone(index, 'tipo', e.target.value)} style={{ ...inputStyle, width: '150px' }}>
                <option value="CELULAR">Celular</option>
                <option value="RESIDENCIAL">Residencial</option>
                <option value="COMERCIAL">Comercial</option>
              </select>
              <input type="text" value={tel.numero} onChange={(e) => atualizarTelefone(index, 'numero', e.target.value)} required style={inputStyle} placeholder="(00) 00000-0000" />
              {telefones.length > 1 && (
                <button type="button" onClick={() => removerTelefone(index)} style={{ padding: '8px', color: 'red', marginBottom: '10px' }}>X</button>
              )}
            </div>
          ))}
          <button type="button" onClick={adicionarTelefone} style={{ padding: '5px 10px' }}>+ Adicionar Telefone</button>
        </fieldset>

        {/* E-MAILS */}
        <fieldset style={cardStyle}>
          <legend><b>E-mails</b></legend>
          {emails.map((em, index) => (
            <div key={index} style={{ ...rowStyle, alignItems: 'center' }}>
              <input type="email" value={em.email} onChange={(e) => atualizarEmail(index, e.target.value)} required style={inputStyle} placeholder="exemplo@email.com" />
              {emails.length > 1 && (
                <button type="button" onClick={() => removerEmail(index)} style={{ padding: '8px', color: 'red', marginBottom: '10px' }}>X</button>
              )}
            </div>
          ))}
          <button type="button" onClick={adicionarEmail} style={{ padding: '5px 10px' }}>+ Adicionar E-mail</button>
        </fieldset>

        {/* BOTÕES DE AÇÃO */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" disabled={salvando} style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            {salvando ? 'Salvando...' : 'Salvar Cliente'}
          </button>
          <button type="button" onClick={() => navigate('/clientes')} style={{ padding: '12px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}

export default NovoCliente;