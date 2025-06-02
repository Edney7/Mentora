import React, { useState, useEffect, useCallback } from "react";
import "../styles/Cadastro.css"; // Certifique-se que o caminho está correto
import animacaoCadastro from "../assets/animacaoCadastro.png"; // Certifique-se que o caminho está correto
import {
  buscarTurmasAtivas, // Usar a função que busca turmas ativas
  buscarDisciplinas,
  cadastrarUsuario,
} from "../services/ApiService"; // Ajuste o caminho se necessário
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
// Considere usar uma biblioteca de notificações como react-toastify
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimentoInput, setDataNascimentoInput] = useState(""); // Estado para o input date (formato yyyy-MM-dd)
  const [sexo, setSexo] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaRepetida, setSenhaRepetida] = useState("");

  const [tipoUsuario, setTipoUsuario] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState([]); // Array para IDs de disciplinas

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

  // Função para formatar data de yyyy-MM-dd (do input) para dd-MM-yyyy (para o backend)
  const formatarDataParaBackend = (dataYYYYMMDD) => {
    if (!dataYYYYMMDD) return "";
    const partes = dataYYYYMMDD.split("-"); // [yyyy, MM, dd]
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`; // Retorna dd-MM-yyyy
    }
    return ""; // Retorna vazio se o formato for inesperado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");

    if (
      !nome.trim() ||
      !cpf ||
      !dataNascimentoInput ||
      !sexo ||
      !email ||
      !senha ||
      !senhaRepetida ||
      !tipoUsuario
    ) {
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
      setErro(
        "Por favor, selecione pelo menos uma disciplina para o professor."
      );
      setLoading(false);
      return;
    }
    if (disciplinasSelecionadas.length > 2 && tipoUsuario === "PROFESSOR") {
      setErro(
        "Um professor pode ser vinculado a no máximo 2 disciplinas no cadastro inicial."
      );
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
      setErro(
        "Formato de data de nascimento inválido. Utilize o seletor de data."
      );
      setLoading(false);
      return;
    }

    const dadosUsuario = {
      nome,
      cpf,
      dtNascimento: dataFormatadaBackend, // Nome do campo correto e valor formatado
      sexo,
      email,
      senha,
      tipoUsuario,
      turmaId: tipoUsuario === "ALUNO" ? turmaSelecionada || null : null,
      // Envia um array de IDs de disciplinas para o backend
      disciplinaIds:
        tipoUsuario === "PROFESSOR"
          ? disciplinasSelecionadas
              .map((id) => parseInt(id, 10))
              .filter((id) => !isNaN(id) && id !== null)
          : null,
    };

    try {
      await cadastrarUsuario(dadosUsuario);
      setSucesso("Cadastro de usuário realizado com sucesso!");
      alert("Cadastro de usuário realizado com sucesso!"); // Pode substituir por toast

      // Limpa os campos
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
      // navigate("/login"); // Opcional: redirecionar
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      const errorMsg =
        error.response?.data?.message ||
        (error.response?.data?.errors &&
          error.response.data.errors[0]?.defaultMessage) ||
        error.message ||
        "Erro desconhecido ao cadastrar.";
      setErro(`Erro ao cadastrar usuário: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const carregarDependenciasTipoUsuario = useCallback(async () => {
    setErro("");
    setLoading(true); // Adiciona loading ao carregar dependências
    if (tipoUsuario === "ALUNO") {
      try {
        const data = await buscarTurmasAtivas(); // Usando buscarTurmasAtivas
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

  // Handler para o select múltiplo de disciplinas
  const handleDisciplinasChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    if (values.length > 2) {
      // Sua regra de negócio para no máximo 2 disciplinas
      setErro("Você pode selecionar no máximo 2 disciplinas.");
      // Mantém a seleção anterior ou apenas as duas primeiras
      setDisciplinasSelecionadas(values.slice(0, 2));
    } else {
      setDisciplinasSelecionadas(values);
      if (erro === "Você pode selecionar no máximo 2 disciplinas.") setErro(""); // Limpa o erro específico
    }
  };

  return (
    <div className="cadastro-container">
      {/* <ToastContainer /> */}
      <img
        src={animacaoCadastro}
        alt="Estudante com livros"
        className="animacaoCadastro"
      />
      <div className="cadastro-left"></div>

      <div className="cadastro-right">
        <div className="cadastro-form-container">
          {" "}
          {/* Container para o formulário */}
          <div className="header-formulario-cadastro">
            {" "}
            {/* Cabeçalho do formulário */}
            <div
              className="voltar-seta-cadastro"
              onClick={() => navigate(-1)}
              title="Voltar"
            >
              <FaArrowLeft />
            </div>
            <h1 className="cadastro-title">Cadastro de Usuário</h1>
          </div>
          {erro && <p className="error-message">{erro}</p>}
          {sucesso && <p className="success-message">{sucesso}</p>}
          <form className="form-cadastro" onSubmit={handleSubmit}>
            {" "}
            {/* Classe para o formulário */}
            <input
              type="text"
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              minLength={3}
              maxLength={100}
            />
            <div className="form-grid">
              <input
                type="text"
                placeholder="CPF (000.000.000-00)"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                required
                minLength={14}
                maxLength={14}
              />
              <input
                type="date" // O input type="date" do HTML usa o formato yyyy-MM-dd
                // placeholder="Data de Nascimento" // Placeholder não funciona bem com type="date"
                value={dataNascimentoInput} // Vinculado ao estado correto
                onChange={(e) => setDataNascimentoInput(e.target.value)}
                required
              />
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                required
              >
                <option value="">Sexo</option>
                <option value="Feminino">Feminino</option>{" "}
                {/* Valores mais descritivos */}
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              minLength={10}
              maxLength={100}
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
                  required={tipoUsuario === "ALUNO"} // Torna obrigatório se for aluno
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
                  multiple // Habilita seleção múltipla
                  value={disciplinasSelecionadas} // Vinculado ao array de IDs
                  onChange={handleDisciplinasChange} // Handler para seleção múltipla
                  required={tipoUsuario === "PROFESSOR"} // Torna obrigatório se for professor
                  size={Math.min(disciplinas.length, 3) || 1} // Mostra alguns itens, ou 1 se vazio
                  className="select-disciplinas-multiplo" // Para estilização específica se necessário
                >
                  {/* <option value="" disabled>Selecione até 2 Disciplinas (Ctrl+Click)</option> // Instrução */}
                  {disciplinas.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nome}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-senha-grid">
              <input
                type="password"
                placeholder="Senha (mínimo 6 caracteres)"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                maxLength={20}
              />
              <input
                type="password"
                placeholder="Repetir Senha"
                value={senhaRepetida}
                onChange={(e) => setSenhaRepetida(e.target.value)}
                required
                minLength={6}
                maxLength={20}
              />
            </div>
            <button type="submit" className="btn-cadastrar" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
