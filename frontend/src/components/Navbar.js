// src/components/Navbar.js

import React from "react";
import { Link } from 'react-router-dom'; // 1. Importe o Link
import "../styles/Navbar.css";
import usuario from "../assets/usuario.png"; 
import logout from "../assets/logout.png"; 
import logo from "../assets/logo.png"

export default function Navbar({ onLogout }) {
  return (
    <header className="navbar-container">
      <div className="navbar-left">
        {/* 2. Envolva o ícone com o componente Link */}
        <Link to="/perfil" title="Ver Perfil">
          <img src={usuario} alt="Usuário" className="navbar-user-icon" />
        </Link>
      </div>

      <div className="navbar-center">
          <img src={logo} alt="Logo" className="navbar-logo"></img>
      </div>
      <div className="navbar-right" onClick={onLogout} title="Sair">
        <a href="/"><img src={logout} alt="Logout" className="navbar-logout-icon" /></a>
      </div>
    </header>
  );
}