import React, { useState } from "react";
import "../../styles/professor/HomeProfessor.css";
import Calendar from "../../components/Calendario";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";

export default function HomeProfessor() {
  const navigate = useNavigate();

  const [modalAberto, setModalAberto] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
 const idUsuario = localStorage.getItem("idUsuario");
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
          <div
            className="ausencia-card"
            onClick={abrirModal}
            style={{ cursor: "pointer" }}
          >
            <h2>Ausência Planejada</h2>
          </div>
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
        </main>

        <section className="event-panel">
          <div className="event-card branco">
            <div className="calendar-container">
              <Calendar />
            </div>
          </div>

          <div className="event-group">
            <div className="event-card verde">
              <span>Próximo Feriado</span>
              <span className="hora">xx/xx</span>
            </div>
            <button
              className="event-card laranja"
              onClick={() =>
                navigate("/secretaria/calendario/eventos/cadastrar")
              }
            >
              <h2>Cadastrar Eventos</h2>
            </button>
          </div>
        </section>

        {modalAberto && (
          <div className="modal-backdrop">
            <div className="modal">
              <label>
                <strong>Descrição</strong>
              </label>
              <textarea
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              <label>
                <strong>Data</strong>
              </label>
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
