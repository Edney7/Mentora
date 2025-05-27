import React, { useState } from "react";
import "../styles/Login.css";
import animacaoLogin from "../assets/animacaoLogin.png"; 
import logo from "../assets/logo.png"; 
import { loginUsuario } from "../services/ApiService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState(null);
  const [erroSenha, setErroSenha] = useState(null);
  const [erroLogin, setErroLogin] = useState(null);

  const navigate = useNavigate();

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErroEmail(null);
    setErroSenha(null);
    setErroLogin(null);

    
    let validar = true;

    if (!validarEmail(email)) {
      setErroEmail("Email inválido");
      validar = false;
    }
    if (senha.length < 6) {
      setErroSenha("Senha deve ter no mínimo 6 caracteres");
      validar = false;
    }

    if (!validar) return;

    try {
      const data = await loginUsuario(email, senha);
      localStorage.setItem("token", data.token);
      alert("Login efetuado com sucesso!");
      navigate("/homeSecretaria");
    } catch (error) {
      const mensagemErro =
        error.response?.data?.mensagem ||
        error.response?.data ||
        "Erro no login";
      setErroLogin(mensagemErro);
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
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {erroEmail && <p style={{ color: "red" }}>{erroEmail}</p>}

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required minLength={6}
            />
            {erroSenha && <p style={{ color: "red" }}>{erroSenha}</p>}

            <div className="login-actions">
              <a href="#">Redefinir senha</a>
            </div>

            <button type="submit">ENTRAR</button>
            {erroLogin && <p style={{ color: "red", marginTop: "10px" }}>{erroLogin}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
