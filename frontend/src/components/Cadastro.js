import React, { useState } from "react";
import "../styles/Cadastro.css";
import animacaoCadastro from "../assets/animacaoCadastro.png"; 


export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dtNascimento, setDtNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div className="cadastro-container">
      <img src={animacaoCadastro} alt="Estudante com livros" className="animacaoCadastro" />

      <div className="cadastro-left"></div>

      <div className="cadastro-right">
        <div className="cadastro-form">
          <h1 className="cadastro-title">Cadastro de Usuário</h1>
          <form>
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
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="grid">
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Tipo de Usuário</option>
                <option value="secretaria">Secretaria</option>
                <option value="professor">Professor</option>
                <option value="aluno">Aluno</option>
              </select>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
