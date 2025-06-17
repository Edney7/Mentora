import React, { useState } from "react";
import "../styles/Login.css";
import animacaoLogin from "../assets/animacaoLogin.png";
import logo from "../assets/logo.png";
import { loginUsuario } from "../services/ApiService";
import { useNavigate, Link } from "react-router-dom"; // Importa o Link
import { toast } from 'react-toastify'; // 1. Importa o toast

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  // const [erro, setErro] = useState(""); // 2. Não precisamos mais do estado de erro
  const [loading, setLoading] = useState(false); // Adicionado para desabilitar o botão
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação básica (opcional, mas recomendada)
    if (senha.length < 6) {
        toast.error("A senha deve ter no mínimo 6 caracteres.");
        setLoading(false);
        return;
    }

    try {
      const data = await loginUsuario(email, senha);
      
      // 3. Adicionada uma notificação de sucesso
      toast.success("Login efetuado com sucesso!");
      
      localStorage.setItem("userId", data.id);
      localStorage.setItem("tipoUsuario", data.tipoUsuario);
      
      if (data.professorId) {
        localStorage.setItem("idProfessor", data.professorId);
      }

      // Um pequeno atraso para o usuário ver o toast antes de ser redirecionado
      setTimeout(() => {
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
            toast.error("Tipo de usuário desconhecido.");
            setLoading(false);
            break;
        }
      }, 800); // 0.8 segundos de atraso

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      const errorMsg = error.response?.data?.message || "Email ou senha inválidos.";
      
      // 4. A mensagem de erro agora é um toast
      toast.error(errorMsg);
      setLoading(false);
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
              {/* 5. Usando o componente Link para navegação correta */}
              <Link to="/esqueci-senha">Redefinir senha</Link>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "ENTRAR"}
            </button>
            {/* 6. A mensagem de erro em <p> foi removida */}
          </form>
        </div>
      </div>
    </div>
  );
}