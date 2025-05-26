import React, { useState, useEffect } from "react";
import "../styles/Cadastro.css";
import animacaoCadastro from "../assets/animacaoCadastro.png"; 
import { buscarTurmas, buscarDisciplinas } from "../services/ApiService";
import { showSuccess, showError, Toast } from "../components/Toast"; // se estiver usando react-toastify encapsulado
import { cadastrarUsuario } from "../services/ApiService"; // função para cadastrar usuário

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


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !cpf || !dtNascimento || !sexo || !email || !senha || !senhaRepetida) {
      showError("Todos os campos são obrigatórios.");
      return;
    }

    if (senha !== senhaRepetida) {
      showError("As senhas não coincidem.");
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
      disciplina2Id: disciplina2 || null, // se for professor
    };

    try {
      await cadastrarUsuario(dadosUsuario);
      showSuccess("Usuário cadastrado com sucesso!");
    } catch (error) {
      showError("Erro ao cadastrar usuário. Tente novamente.");
    }
  }
  
  useEffect(() => {
    if (tipoUsuario === "aluno") {
      buscarTurmas().then(setTurmas).catch(console.error);
    } else if (tipoUsuario === "professor") {
      buscarDisciplinas().then(setDisciplinas).catch(console.error);
    }
  }, [tipoUsuario]);

  return (
    <div className="cadastro-container">
      <img src={animacaoCadastro} alt="Estudante com livros" className="animacaoCadastro" />

      <div className="cadastro-left"></div>

      <div className="cadastro-right">
        <div className="cadastro-form">
          <h1 className="cadastro-title">Cadastro de Usuário</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <div className="form-grid">
              <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <input
                type="date"
                placeholder="Data de Nascimento"
                value={dtNascimento}
                onChange={(e) => setDtNascimento(e.target.value)}
              />
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
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
            />

            <div className="form-grid">
              <select
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
              >
                <option value="">Tipo de Usuário</option>
                <option value="SECREATARIA">Secretaria</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ALUNO">Aluno</option>
              </select>
              {/* se for aluno → mostrar select com turmas */}
              {tipoUsuario === "aluno" && (
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
              {tipoUsuario === "professor" && (
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
              />
              <input
                type="password"
                placeholder="Repetir senha"
                value={senhaRepetida}
                onChange={(e) => setSenhaRepetida(e.target.value)}
              />
              </div>
            <button type="submit" >Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
