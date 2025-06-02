import React from "react";
import "../../styles/HomeProfessor.css";
import Navbar from "../../components/Navbar";

export default function HomeProfessor() {
  const turmas = [
    { nome: "Turma 1", turno: "MANHÃ", serie: "3° SÉRIE" },
    { nome: "Turma 2", turno: "MANHÃ", serie: "2° SÉRIE" },
    { nome: "Turma 3", turno: "MANHÃ", serie: "1° SÉRIE" },
    { nome: "Turma 4", turno: "MANHÃ", serie: "3° SÉRIE" },
  ];

  return (
    <>
      <Navbar onLogout={() => console.log("Logout clicado")} />
      <div className="home-secretaria-container">
        <main className="main-content-turmas">
          <div className="turmas-grid">
            {turmas.map((turma, index) => (
              <div key={index} className="card-turma-box">
                <h2>{turma.nome}</h2>
                <div className="turma-info">
                  <div>
                    <p className="label">TURNO</p>
                    <p>{turma.turno}</p>
                  </div>
                  <div>
                    <p className="label">SÉRIE</p>
                    <p>{turma.serie}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ausencia-card">
            <h2>Ausência Planejada</h2>
          </div>
        </main>

        <section className="event-panel">
          <div className="event-card branco"></div>

          <div className="event-card amarelo">
            <span>Evento Hoje</span>
            <span className="hora">07:00 | 7:45</span>
          </div>

          <div className="event-card azul">
            <span>Proximo Evento</span>
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
