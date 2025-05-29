import React from "react";
import "../../styles/Home.css"; // Certifique-se de que o caminho está correto
import Navbar from "../../components/Navbar"; // Certifique-se de que o caminho está correto

export default function HomeSecretaria() {
  return (
    <>
    <Navbar onLogout={() => console.log("Logout clicado")} />
    <div className="home-secretaria-container">
      
   <h1>Secretaria</h1>
      <main className="main-content">
        <a href="/listaUsuario" className="top-card">
        <div >
        
          <h2>Gerenciar Usuarios</h2>
        </div>
      </a>
        <div className="button-grid">
          <button className="btn">Gerenciar Turmas</button>
          <button className="btn">Gerenciar Disciplinas</button>
        </div>
      </main>

      <section className="event-panel">
        
      </section>
    </div>
    </>
  );
}

/* HomeSecretaria.css */
