import React, { useState } from "react";
import "../styles/Login.css";
import animacaoLogin from "../assets/animacaoLogin.png";
import logo from "../assets/logo.png";
import { loginUsuario } from "../services/ApiService";
import { useNavigate } from "react-router-dom";
//implementar o toast e verificar o regex
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

      alert("Login efetuado com sucesso!");
      localStorage.setItem("idUsuario", data.id);
      localStorage.setItem("tipoUsuario", data.tipoUsuario);
      localStorage.setItem("usuario", JSON.stringify(data));
      
      switch (data.tipoUsuario.toUpperCase()) {
        case "SECRETARIA":
          navigate("/homeSecretaria");
          break;
        case "ALUNO":
          navigate("/homeAluno");
          break;
        case "PROFESSOR":
          navigate("/homeProfessor");
          break;
        default:
          alert("Tipo de usuário inválido.");
          break;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      let mensagemErro = "Erro no login";

      // Se a mensagem estiver dentro de error.response.data.message
      if (typeof error.response?.data?.message === "string") {
        mensagemErro = error.response.data.message;
      }

      // Se error.response.data for uma string diretamente
      else if (typeof error.response?.data === "string") {
        mensagemErro = error.response.data;
      }

      // Se não encontrar nenhuma string, força string com JSON.stringify
      else if (error.response?.data) {
        mensagemErro = JSON.stringify(error.response.data);
      }

      setErroLogin(mensagemErro);
    }
  };

  return (
    <div className="login-container">
      <img
        src={animacaoLogin}
        alt="Estudante com livros"
        className="animacaoLogin"
      />

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
              required
              minLength={6}
            />
            {erroSenha && <p style={{ color: "red" }}>{erroSenha}</p>}

            <div className="login-actions">
              <a href="/">Redefinir senha</a>
            </div>

            <button type="submit">ENTRAR</button>
            {erroLogin && (
              <p style={{ color: "red", marginTop: "10px" }}>
                {String(erroLogin)}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
