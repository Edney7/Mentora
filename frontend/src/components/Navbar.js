import React from "react";
import "../styles/Navbar.css";
import usuario from "../assets/usuario.png"; // substitua pelo caminho correto
import logout from "../assets/logout.png"; // substitua pelo caminho correto

export default function Navbar({ onLogout }) {
  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <a href="/login"><img src={usuario} alt="Usuário" className="navbar-user-icon" /></a>
      </div>
      <div className="navbar-right" onClick={onLogout} title="Sair">
        <a href="/login"><img src={logout} alt="Logout" className="navbar-logout-icon" /></a>
      </div>
    </header>
  );
}