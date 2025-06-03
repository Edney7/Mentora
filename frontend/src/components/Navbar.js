import React from "react";
import "../styles/Navbar.css";
import usuario from "../assets/usuario.png"; 
import logout from "../assets/logout.png"; 
import logo from "../assets/logo.png"
export default function Navbar({ onLogout }) {
  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <img src={usuario} alt="Usuário" className="navbar-user-icon" />
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