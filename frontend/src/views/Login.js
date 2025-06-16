import React, { useState } from "react";
import "../styles/Login.css";
import animacaoLogin from "../assets/animacaoLogin.png";
import logo from "../assets/logo.png";
import { loginUsuario } from "../services/ApiService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const data = await loginUsuario(email, senha);
      
      localStorage.setItem("userId", data.id);
      localStorage.setItem("tipoUsuario", data.tipoUsuario);
      
      if (data.professorId) {
        localStorage.setItem("idProfessor", data.professorId);
      }

      switch (data.tipoUsuario.toUpperCase()) {
        case "SECRETARIA":
          navigate("/homeSecretaria");
          break;
        case "ALUNO":
          navigate("/homeAluno"); // Rota de exemplo
          break;
        case "PROFESSOR":
          navigate("/homeProfessor");
          break;
        default:
          setErro("Tipo de usuário desconhecido.");
          break;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErro(error.response?.data?.message || "Email ou senha inválidos.");
    }
  };

  return (
    <div className="login-container">
      <img src={animacaoLogin} alt="Estudante com livros" className="animacaoLogin" />
      <div className="login-left"></div>
      <div className="login-right">
        <div className="login-form">
          <img src={logo} alt="logo mentora" className="login-image" />
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            <div className="login-actions">
              <a href="/">Redefinir senha</a>
            </div>
            <button type="submit">ENTRAR</button>
            {erro && <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}