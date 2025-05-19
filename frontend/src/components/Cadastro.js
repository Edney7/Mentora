import React, { useState } from "react";
import "../styles/Cadastro.css";
import animacaoCadastro from "../assets/animacaoCadastro.png"; 
import logo from "../assets/logo.png"; // Substitua pela imagem correta

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dtNascimento, setDtNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [senha, setSenha] = useState("");


 /* const handleSubmit = (e) => {
    e.preventDefault();
    alert(`CPF: ${cpf}\nSenha: ${senha}`);
  };
*/
  return (
    <div className="cadastro-container">
    
      <div className="cadastro-left">
        {/* Substitua pela imagem real ou SVG correspondente */}
        <img src={animacaoCadastro} alt="Estudante com livros" className="animacaoCadastro" />
      </div>

      <div className="cadastro-right">
        <div className="cadastro-form">
          <h1 className="cadastro-title">Cadastro de Usuario</h1>
          <form >
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <div className="container" >
            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            <input
              type="date"
              placeholder="Data tNascimento"
              value={dtNascimento}
              onChange={(e) => setDtNascimento(e.target.value)}
            />
            </div>
            <select
              type="text"
              placeholder="Sexo"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}>
                <option value="">Selecione o sexo</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <select
              placeholder="Tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}>
              <otion>Femino</otion>
              <otion>Masculino</otion>
            </select >
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <div className="login-actions">
              <a href="#">Redefinir senha</a>
            </div>

            <button type="submit">ENTRAR</button>
          </form>
        </div>
      </div>
    </div>
  );
}
