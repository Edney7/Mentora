import React, { useEffect, useState } from "react";
import "../../styles/secretaria/Cadastro.css"; 
import animacaoCadastro from "../../assets/animacaoCadastro.png"; 
import { 
    buscarTurmasAtivas, 
    buscarDisciplinas, 
    cadastrarUsuario 
} from "../../services/ApiService"; 
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // 1. Importa o toast

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimentoInput, setDataNascimentoInput] = useState(""); 
  const [sexo, setSexo] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaRepetida, setSenhaRepetida] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState([]); 
  const [loading, setLoading] = useState(false); 
  // O estado 'erro' foi removido em favor do toast
  const navigate = useNavigate(); 

  const formatarCPF = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatarDataParaBackend = (dataYYYYMMDD) => {
    if (!dataYYYYMMDD) return "";
    const [ano, mes, dia] = dataYYYYMMDD.split("-"); 
    return `${dia}/${mes}/${ano}`; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 2. Validações agora usam toast
    if (!nome.trim() || !cpf || !dataNascimentoInput || !sexo || !email || !senha || !senhaRepetida || !tipoUsuario) {
      toast.warn("Todos os campos básicos e o tipo de usuário são obrigatórios.");
      setLoading(false);
      return;
    }
    if (tipoUsuario === "ALUNO" && !turmaSelecionada) {
      toast.warn("Por favor, selecione a turma para o aluno.");
      setLoading(false);
      return;
    }
    if (tipoUsuario === "PROFESSOR" && disciplinasSelecionadas.length === 0) {
      toast.warn("Por favor, selecione ao menos uma disciplina para o professor.");
      setLoading(false);
      return;
    }
    if (senha !== senhaRepetida) {
      toast.error("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const dataFormatadaBackend = formatarDataParaBackend(dataNascimentoInput);
    if (!dataFormatadaBackend) {
        toast.error("Formato de data de nascimento inválido.");
        setLoading(false);
        return;
    }

    const dadosUsuario = {
      nome,
      cpf,
      dtNascimento: dataFormatadaBackend, 
      sexo,
      email,
      senha,
      tipoUsuario,
      turmaId: tipoUsuario === "ALUNO" ? parseInt(turmaSelecionada, 10) : null,
      disciplinaIds: tipoUsuario === "PROFESSOR" ? disciplinasSelecionadas.map(id => parseInt(id, 10)) : [],
    };

    try {
      await cadastrarUsuario(dadosUsuario);
      toast.success("Usuário cadastrado com sucesso!");
      
      // Limpa o formulário
      setNome(""); setCpf(""); setDataNascimentoInput(""); setSexo(""); setEmail("");
      setSenha(""); setSenhaRepetida(""); setTipoUsuario(""); setTurmaSelecionada("");
      setDisciplinasSelecionadas([]);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      const errorMsg = error.response?.data?.message || 
                       (error.response?.data?.errors && error.response.data.errors[0]?.defaultMessage) || 
                       "Erro desconhecido ao cadastrar.";
      toast.error(`Erro: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 3. Lógica otimizada para carregar dependências
  useEffect(() => {
    const carregarDependencias = async () => {
      setLoading(true);
      // Limpa campos dependentes ao trocar o tipo de usuário
      setTurmas([]); setDisciplinas([]);
      setTurmaSelecionada(""); setDisciplinasSelecionadas([]);

      if (tipoUsuario === "ALUNO") {
        try {
          const data = await buscarTurmasAtivas(); 
          setTurmas(data || []);
        } catch (err) {
          toast.error("Falha ao carregar lista de turmas.");
        }
      } else if (tipoUsuario === "PROFESSOR") {
        try {
          const data = await buscarDisciplinas();
          setDisciplinas(data || []);
        } catch (err) {
          toast.error("Falha ao carregar lista de disciplinas.");
        }
      }
      setLoading(false);
    };

    carregarDependencias();
  }, [tipoUsuario]);

  const handleDisciplinasChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setDisciplinasSelecionadas(selected);
  };

  return (
    <div className="cadastro-container">
      <img src={animacaoCadastro} alt="Estudante com livros" className="animacaoCadastro" />
      <div className="cadastro-left"></div>
      <div className="cadastro-right">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <h1 className="cadastro-title">Cadastro de Usuário</h1>
          <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar"><FaArrowLeft /></div>
          
          {/* O erro em <p> foi removido em favor do toast */}
          
          <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required minLength={3} maxLength={100} />
          
          <div className="form-grid">
            <input type="text" placeholder="CPF (000.000.000-00)" value={cpf} onChange={(e) => setCpf(formatarCPF(e.target.value))} required minLength={14} maxLength={14} />
            <input type="date" value={dataNascimentoInput} onChange={(e) => setDataNascimentoInput(e.target.value)} required />
            <select value={sexo} onChange={(e) => setSexo(e.target.value)} required>
              <option value="">Sexo</option>
              <option value="Feminino">Feminino</option> 
              <option value="Masculino">Masculino</option>
            </select>
          </div>

          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <div className="form-grid">
            <select value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)} required>
              <option value="">Selecione o Tipo de Usuário</option>
              <option value="SECRETARIA">Secretaria</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ALUNO">Aluno</option>
            </select>
            
            {tipoUsuario === "ALUNO" && (
              <select value={turmaSelecionada} onChange={(e) => setTurmaSelecionada(e.target.value)} required>
                <option value="">Selecione a Turma</option>
                {turmas.map((turma) => <option key={turma.id} value={turma.id}>{turma.nome}</option>)}
              </select>
            )}

            {tipoUsuario === "PROFESSOR" && (
              // 4. Corrigido para permitir seleção múltipla
              <select
                multiple={true} // Habilita a seleção múltipla
                value={disciplinasSelecionadas} 
                onChange={handleDisciplinasChange} 
                required
                className="select-multiple" // Classe para estilização opcional
              >
                {/* A primeira opção é desabilitada para não ser selecionável */}
                <option value="" disabled>Selecione a(s) Disciplina(s)</option>
                {disciplinas.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
              </select>
            )}
            {/* Placeholders para manter o grid alinhado */}
            {(tipoUsuario === "SECRETARIA" || !tipoUsuario) && <div />}
          </div>

          <div className="form-senha-grid">
            <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} />
            <input type="password" placeholder="Repetir Senha" value={senhaRepetida} onChange={(e) => setSenhaRepetida(e.target.value)} required minLength={6} />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}