import React, { useState } from "react";
import "../styles/Login.css";
import animacaoLogin from "../assets/animacaoLogin.png"; 
import logo from "../assets/logo.png"; // Substitua pela imagem correta

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`CPF: ${cpf}\nSenha: ${senha}`);
  };

  return (
    <div className="login-container">
    
      <div className="login-left">
        {/* Substitua pela imagem real ou SVG correspondente */}
        <img src={animacaoLogin} alt="Estudante com livros" className="animacaoLogin" />
      </div>

      <div className="login-right">
        <div className="login-form">
          <img src={logo} alt="logo mentora" className="login-image" />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
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
