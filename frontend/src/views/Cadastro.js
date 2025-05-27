import React, { useState, useEffect} from "react";
import "../styles/Cadastro.css";
import animacaoCadastro from "../assets/animacaoCadastro.png"; 
import { buscarTurmas, buscarDisciplinas } from "../services/ApiService";
import { cadastrarUsuario } from "../services/ApiService"; // função para cadastrar usuário

//add toast e colocar o regex de permitir somente caractere em nome
export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dtNascimento, setDtNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaRepetida, setSenhaRepetida] = useState("");

  const [tipoUsuario, setTipoUsuario] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [disciplina1, setDisciplina1] = useState("");
  const [disciplina2, setDisciplina2] = useState("");
  

  const formatarCPF = (value) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
 };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !cpf || !dtNascimento || !sexo || !email || !senha || !senhaRepetida) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    if (senha !== senhaRepetida) {
      alert("As senhas não coincidem.");
      return;
    }

    const dadosUsuario = {
      nome,
      cpf,
      dtNascimento,
      sexo,
      email,
      senha,
      tipoUsuario,
      turmaId: turmaSelecionada || null, // se for aluno
      disciplina1Id: disciplina1 || null, // se for professor
      disciplina2Id: disciplina2 || null, // modificar para aceitar no minimo uma disciplina por professor
    };

    try {
      await cadastrarUsuario(dadosUsuario);
      alert("Cadastro de usuário realizado com sucesso!");
      
      //limpa os campos
        setNome("");
        setCpf("");
        setDtNascimento("");
        setSexo("");
        setEmail("");
        setSenha("");
        setSenhaRepetida("");
        setTipoUsuario("");
        setTurmaSelecionada("");
        setDisciplina1("");
        setDisciplina2("");

    } catch (error) {
      alert("Erro ao cadastrar usuário. Tente novamente.");
    }
  }
  
  useEffect(() => {
    if (tipoUsuario === "ALUNO") {
      buscarTurmas().then(setTurmas).catch(console.error);
    } else if (tipoUsuario === "PROFESSOR") {
      buscarDisciplinas().then(setDisciplinas).catch(console.error);
    }
  }, [tipoUsuario]);

  return (
    <div className="cadastro-container">
      <img src={animacaoCadastro} alt="Estudante com livros" className="animacaoCadastro" />
      <div className="cadastro-left"></div>

      <div className="cadastro-right">
        <div className="cadastro-form">//talvez colocar  a logo aqui
          <h1 className="cadastro-title">Cadastro de Usuário</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required minLength={3} maxLength={100}
            />

            <div className="form-grid">
              <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                required minLength={14} maxLength={14}
              />
              <input
                type="date"
                placeholder="Data de Nascimento"
                value={dtNascimento}
                onChange={(e) => setDtNascimento(e.target.value)}
                required
              />
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                required
              >
                <option value="">Sexo</option>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
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
                <option value="">Tipo de Usuário</option>
                <option value="SECRETARIA">Secretaria</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ALUNO">Aluno</option>
              </select>
              {/* se for aluno → mostrar select com turmas */}
              {tipoUsuario === "ALUNO" && (
                <select
                  value={turmaSelecionada}
                  onChange={(e) => setTurmaSelecionada(e.target.value)}
                >
                  <option value="">Selecione a turma</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              )}

              {/* se for professor → mostrar dois selects com disciplinas */}
              {tipoUsuario === "PROFESSOR" && (
                <>
                  <select
                    value={disciplina1}
                    onChange={(e) => setDisciplina1(e.target.value)}
                  >
                    <option value="">Disciplina 1</option>
                    {disciplinas.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome}
                      </option>
                    ))}
                  </select>

                  <select
                    value={disciplina2}
                    onChange={(e) => setDisciplina2(e.target.value)}
                  >
                    <option value="">Disciplina 2</option>
                    {disciplinas.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div className="form-senha-grid">
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required minLength={6} maxLength={20}
              />
              <input
                type="password"
                placeholder="Repetir senha"
                value={senhaRepetida}
                onChange={(e) => setSenhaRepetida(e.target.value)}
                required minLength={6} maxLength={20}
              />
              </div>
            <button type="submit" >Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
