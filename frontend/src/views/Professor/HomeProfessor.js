import React from "react";
import "../../styles/Home.css";
import Navbar from "../../components/Navbar"; 

export default function HomeProfessor() {
  return (
    <>
    <Navbar onLogout={() => console.log("Logout clicado")} />
    <div className="home-secretaria-container">
      
<h1>Professor</h1>
      <main className="main-content">
        <div className="top-card">
         
          <h2>Gerenciar Usuarios</h2>
        </div>

        <div className="button-grid">
          <button className="btn">Gerenciar Turmas</button>
          <button className="btn">Gerenciar Disciplinas</button>
        </div>
      </main>

      <section className="event-panel">
        <div className="event-card branco"></div>

        <div className="event-card amarelo">
          <span>Evento Hoje</span>
          <span className="hora">07:00 | 7:45</span>
        </div>

        <div className="event-card azul">
          <span>Ausência professor</span>
          <span className="hora">xx/xx</span>
        </div>

        <div className="event-card verde">
          <span>Proximo Feriado</span>
          <span className="hora">xx/xx</span>
        </div>
      </section>
    </div>
    </>
  );
}

