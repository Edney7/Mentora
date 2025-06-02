import React from "react";
import "../../styles/Home.css";
import Navbar from "../../components/Navbar"; 
import { useNavigate } from "react-router-dom";
export default function HomeSecretaria() {
  const Navigate = useNavigate();
  return (
    <>
    <Navbar onLogout={() => console.log("Logout clicado")} />
    <div className="home-secretaria-container">
      
   <h1>Secretaria</h1>
      <main className="main-content">
       
        <div onClick={() => Navigate("/listaUsuario")} className="top-card">
        
          <h2>Gerenciar Usuarios</h2>
        </div>
      
        <div className="button-grid">
          <button  className="btn">Gerenciar Turmas</button>
          <button onClick={() => Navigate("/disciplina")} className="btn">Gerenciar Disciplinas</button>
        </div>
      </main>

      <section className="event-panel">
        
      </section>
    </div>
    </>
  );
}

/* HomeSecretaria.css */
