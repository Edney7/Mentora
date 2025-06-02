import React, {useState} from "react";
import "../../styles/Home.css";
import Navbar from "../../components/Navbar"; 
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/Calendar"; // Importando o componente Calendar
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
        <div className="event-card branco">
          <Calendar  /></div>
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

/* HomeSecretaria.css */
