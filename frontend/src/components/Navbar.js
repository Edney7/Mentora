// src/components/Navbar.js

import React from "react";
import { Link } from 'react-router-dom';
import "../styles/Navbar.css";
import usuario from "../assets/usuario.png"; 
import logout from "../assets/logout.png"; 
import logo from "../assets/logo.png"

export default function Navbar({ onLogout }) {
  // LÊ O TIPO DE USUÁRIO DIRETAMENTE DO LOCALSTORAGE
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  // DECIDE PARA QUAL ROTA DE PERFIL ENVIAR O USUÁRIO
  let linkDoPerfil = "/perfil"; // Rota padrão (da secretaria)
  if (tipoUsuario === 'PROFESSOR') {
    linkDoPerfil = "/professor/perfil";
  } else if (tipoUsuario === 'ALUNO') {
    linkDoPerfil = "/aluno/perfil"; // Exemplo para o futuro
  }

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        {/* O 'to' agora é dinâmico, baseado no tipo de usuário */}
        <Link to={linkDoPerfil} title="Ver Perfil">
          <img src={usuario} alt="Usuário" className="navbar-user-icon" />
        </Link>
      </div>
      <div className="navbar-center">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>
      <div 
        className="navbar-right" 
        onClick={onLogout} 
        title="Sair"
        style={{ cursor: 'pointer' }}
      >
        <img src={logout} alt="Logout" className="navbar-logout-icon" />
      </div>
    </header>
  );
}