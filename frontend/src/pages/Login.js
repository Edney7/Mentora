// src/pages/Login.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

// Hooks e Serviços
import { loginUsuario } from "../services/ApiService";
import { useToast } from "../hooks/use-toast";

// Ícones
import { GraduationCap, User, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: () => loginUsuario(email, senha),
    onSuccess: (data) => {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a)!`,
      });

      // Salva os dados corretos no localStorage (sem token)
      localStorage.setItem("userId", data.id);
      localStorage.setItem("tipoUsuario", data.tipoUsuario);
      localStorage.setItem("userName", data.nome); // Assumindo que sua API retorna o nome

      if (data.professorId) {
        localStorage.setItem("idProfessor", data.professorId);
      }

      // Redireciona o usuário após um breve momento
      setTimeout(() => {
        switch (data.tipoUsuario?.toUpperCase()) {
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
            toast({
              title: "Erro",
              description: "Tipo de usuário desconhecido.",
              variant: "destructive",
            });
            break;
        }
      }, 500);
    },
    onError: (error) => {
      const errorMsg =
        error.response?.data?.message || "Email ou senha inválidos.";
      toast({
        title: "Erro no login",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (senha.length < 6) {
      toast({
        title: "Erro de validação",
        description: "A senha deve ter no mínimo 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mb-4">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Sistema Escolar
          </h1>
          <p className="text-gray-600">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          {/*<div className="text-right">
            <Link
              to="/esqueci-senha"
              className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>*/}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full"
          >
            {loginMutation.isPending ? "Entrando..." : "ENTRAR"}
          </Button>
        </form>
      </div>
    </div>
  );
}
