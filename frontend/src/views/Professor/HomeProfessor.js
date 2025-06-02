import React, { useState } from "react";
import "../../styles/HomeProfessor.css";
import Calendar from "../../components/Calendar";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function HomeProfessor() {
  const navigate = useNavigate();

  const turmas = [
    { id: 1, nome: "Turma 1", turno: "MANHÃ", serie: "3° SÉRIE" },
    { id: 2, nome: "Turma 1", turno: "MANHÃ", serie: "3° SÉRIE" },
    { id: 3, nome: "Turma 1", turno: "MANHÃ", serie: "3° SÉRIE" },
    { id: 4, nome: "Turma 1", turno: "MANHÃ", serie: "3° SÉRIE" },
  ];

  const [modalAberto, setModalAberto] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");

  const abrirModal = () => {
    setDescricao("");
    setData("");
    setModalAberto(true);
  };

  const enviarAusencia = () => {
    if (!descricao || !data) return alert("Preencha todos os campos!");
    console.log("Ausência planejada:", { descricao, data });
    setModalAberto(false);
  };

  return (
    <>
      <Navbar onLogout={() => console.log("Logout clicado")} />
      <div className="home-secretaria-container">
        <main className="main-content-turmas">
          <div className="turmas-grid">
            {turmas.map((turma) => (
              <div
                key={turma.id}
                className="card-turma-box"
                onClick={() => navigate(`/turmaDetalhe/${turma.id}`)}
                style={{ cursor: "pointer" }}
              >
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

          <div className="ausencia-card" onClick={abrirModal} style={{ cursor: "pointer" }}>
            <h2>Ausência Planejada</h2>
          </div>
        </main>

        <section className="event-panel">
          <div className="event-card branco">
            <div className="calendar-container">
              <Calendar />
            </div>
          </div>
          <div className="event-group">
            <button className="event-card laranja">
              <h2>Evento Hoje</h2>
            </button>
            <div className="event-card verde">
              <span>Próximo Evento</span>
              <span className="hora">xx/xx</span>
            </div>
            <div className="event-card branco">
              <span>Próximo Feriado</span>
              <span className="hora">xx/xx</span>
            </div>
          </div>
        </section>

        {modalAberto && (
          <div className="modal-backdrop">
            <div className="modal">
              <label><strong>Descrição</strong></label>
              <textarea
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              <label><strong>Data</strong></label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />

              <button onClick={enviarAusencia}>ENVIAR</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
