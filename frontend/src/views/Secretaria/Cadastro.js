import React, { useState, useEffect, useCallback } from "react";
import "../../styles/secretaria/Cadastro.css"; 
import animacaoCadastro from "../../assets/animacaoCadastro.png"; 
import { 
    buscarTurmasAtivas, 
    buscarDisciplinas, 
    cadastrarUsuario 
} from "../../services/ApiService"; 
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate(); 

  const formatarCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const formatarDataParaBackend = (dataYYYYMMDD) => {
    if (!dataYYYYMMDD) return "";
    const partes = dataYYYYMMDD.split("-"); 
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`; 
    }
    return ""; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");

    if (!nome.trim() || !cpf || !dataNascimentoInput || !sexo || !email || !senha || !senhaRepetida || !tipoUsuario) {
      setErro("Todos os campos básicos e o tipo de usuário são obrigatórios.");
      setLoading(false);
      return;
    }
    if (tipoUsuario === "ALUNO" && !turmaSelecionada) {
      setErro("Por favor, selecione a turma para o aluno.");
      setLoading(false);
      return;
    }
    if (tipoUsuario === "PROFESSOR" && disciplinasSelecionadas.length === 0) {
      setErro("Por favor, selecione pelo menos uma disciplina para o professor.");
      setLoading(false);
      return;
    }
     if (disciplinasSelecionadas.length > 2 && tipoUsuario === "PROFESSOR") {
      setErro("Um professor pode ser vinculado a no máximo 2 disciplinas no cadastro inicial.");
      setLoading(false);
      return;
    }
    if (senha !== senhaRepetida) {
      setErro("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const dataFormatadaBackend = formatarDataParaBackend(dataNascimentoInput);
    if (!dataFormatadaBackend) {
        setErro("Formato de data de nascimento inválido. Utilize o seletor de data.");
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
      turmaId: tipoUsuario === "ALUNO" ? (turmaSelecionada || null) : null,
      disciplinaIds: tipoUsuario === "PROFESSOR" ? disciplinasSelecionadas.map(id => parseInt(id, 10)).filter(id => !isNaN(id) && id !== null) : null,
    };

    try {
      await cadastrarUsuario(dadosUsuario);
      setSucesso("Cadastro de usuário realizado com sucesso!");
      alert("Cadastro de usuário realizado com sucesso!"); 
      
      setNome("");
      setCpf("");
      setDataNascimentoInput("");
      setSexo("");
      setEmail("");
      setSenha("");
      setSenhaRepetida("");
      setTipoUsuario("");
      setTurmaSelecionada("");
      setDisciplinasSelecionadas([]);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      const errorMsg = error.response?.data?.message || 
                       (error.response?.data?.errors && error.response.data.errors[0]?.defaultMessage) || 
                       error.message || 
                       "Erro desconhecido ao cadastrar.";
      setErro(`Erro ao cadastrar usuário: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };
  
  const carregarDependenciasTipoUsuario = useCallback(async () => {
    setErro(""); 
    setLoading(true); 
    if (tipoUsuario === "ALUNO") {
      try {
        const data = await buscarTurmasAtivas(); 
        setTurmas(data || []);
      } catch (err) {
        console.error("Erro ao buscar turmas:", err);
        setErro("Falha ao carregar lista de turmas.");
        setTurmas([]);
      }
      setDisciplinasSelecionadas([]); 
    } else if (tipoUsuario === "PROFESSOR") {
      try {
        const data = await buscarDisciplinas();
        setDisciplinas(data || []);
      } catch (err) {
        console.error("Erro ao buscar disciplinas:", err);
        setErro("Falha ao carregar lista de disciplinas.");
        setDisciplinas([]);
      }
      setTurmaSelecionada(""); 
    } else {
      setTurmas([]);
      setDisciplinas([]);
      setTurmaSelecionada("");
      setDisciplinasSelecionadas([]);
    }
    setLoading(false);
  }, [tipoUsuario]);

  useEffect(() => {
    carregarDependenciasTipoUsuario();
  }, [carregarDependenciasTipoUsuario]);

  const handleDisciplinasChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    if (values.length > 2) { 
        setErro("Você pode selecionar no máximo 2 disciplinas.");
        setDisciplinasSelecionadas(values.slice(0, 2)); 
    } else {
        setDisciplinasSelecionadas(values);
        if (erro === "Você pode selecionar no máximo 2 disciplinas.") setErro(""); 
    }
  };

  return (
    <div className="cadastro-container">
      <img
        src={animacaoCadastro}
        alt="Estudante com livros"
        className="animacaoCadastro"
      />
      
      <div className="cadastro-left"></div>
      <div className="cadastro-right">
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <h1 className="cadastro-title">Cadastro de Usuário</h1>
          <div
            className="voltar-seta"
            onClick={() => navigate(-1)}
            title="Voltar"
          >
            <FaArrowLeft />
          </div>
          {erro && <p className="error-message" style={{textAlign: 'center', marginBottom: '15px'}}>{erro}</p>}
          {sucesso && <p className="success-message" style={{textAlign: 'center', marginBottom: '15px'}}>{sucesso}</p>}

          <input
            type="text"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required minLength={3} maxLength={100}
          />
          
          <div className="form-grid">
            <input
              type="text"
              placeholder="CPF (000.000.000-00)"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              required minLength={14} maxLength={14}
            />
            <input
              type="date" 
              value={dataNascimentoInput} 
              onChange={(e) => setDataNascimentoInput(e.target.value)}
              required
            />
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              required
            >
              <option value="">Sexo</option>
              <option value="Feminino">Feminino</option> 
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required minLength={10} maxLength={100}
          />

          <div className="form-grid">
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              required
            >
              <option value="">Selecione o Tipo de Usuário</option>
              <option value="SECRETARIA">Secretaria</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ALUNO">Aluno</option>
            </select>
            
            {tipoUsuario === "ALUNO" && (
              <select
                value={turmaSelecionada}
                onChange={(e) => setTurmaSelecionada(e.target.value)}
                required={tipoUsuario === "ALUNO"} 
              >
                <option value="">Selecione a Turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            )}

            {tipoUsuario === "PROFESSOR" && (
              <select
                multiple 
                value={disciplinasSelecionadas} 
                onChange={handleDisciplinasChange} 
                required={tipoUsuario === "PROFESSOR"} 
                size={Math.min(disciplinas.length, 3) || 1} 
                className="select-disciplinas-multiplo" 
              >
                {disciplinas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome}
                  </option>
                ))}
              </select>
            )}
            {tipoUsuario !== "ALUNO" && tipoUsuario !== "PROFESSOR" && <div />} 
            {tipoUsuario === "SECRETARIA" && <div />} 
          </div>
          <div className="form-senha-grid">
            <input
              type="password"
              placeholder="Senha (mínimo 6 caracteres)"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required minLength={6} maxLength={20}
            />
            <input
              type="password"
              placeholder="Repetir Senha"
              value={senhaRepetida}
              onChange={(e) => setSenhaRepetida(e.target.value)}
              required minLength={6} maxLength={20}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
