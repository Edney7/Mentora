import React, { useState, useEffect } from "react";
import "../../styles/professor/HomeProfessor.css";
import Calendar from "../../components/Calendario";
import { useNavigate } from "react-router-dom";
import { listarTurmasDoProfessor, registarAusenciaProfessor } from "../../services/ApiService";

export default function HomeProfessor() {
  const navigate = useNavigate();

  const [modalAberto, setModalAberto] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [data, setData] = useState("");
  const [turmas, setTurmas] = useState([]);

  const idProfessor = localStorage.getItem("idProfessor");
  console.log("ID do prof:", idProfessor);
  const abrirModal = () => {
    setMotivo("");
    setData("");
    setModalAberto(true);
  };

const enviarAusencia = async () => {
  if (!motivo || !data) return alert("Preencha todos os campos!");

  // Formata a data de "yyyy-MM-dd" para "dd-MM-yyyy"
  const formatarDataParaBackend = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}-${mes}-${ano}`;
  };

  try {
    const ausenciaData = {
      motivo,
      dataAusencia: formatarDataParaBackend(data), // nome do campo + formato correto
      professorId: idProfessor
    };

    console.log("Enviando ausência:", ausenciaData);

    await registarAusenciaProfessor(ausenciaData);
    alert("Ausência registrada com sucesso!");
    setModalAberto(false);
  } catch (error) {
    console.error("Erro ao registrar ausência:", error);
    alert("Erro ao registrar ausência.");
  }
};

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const resposta = await listarTurmasDoProfessor(idProfessor);
        setTurmas(resposta);
        console.log(turmas)
      } catch (error) {
        console.error("Erro ao buscar turmas do professor:", error);
        alert("Erro ao carregar turmas.");
      }
    };

    if (idProfessor) {
      carregarTurmas();
    }
  }, [idProfessor]);
  return (
    <>
      
      <div className="home-secretaria-container">
        <main className="main-content-turmas">
      
          <div
            className="ausencia-card"
            onClick={abrirModal}
            style={{ cursor: "pointer" }}
          >
            <h2>Ausência Planejada</h2>
          </div>
          <div className="turmas-lista">
            {turmas.map((turma) => (
              <div
                key={turma.id}
                className="turma-lista-item"
                onClick={() => navigate(`/turmaDetalhe/${turma.id}`)}
              >
                <strong>{turma.nome}</strong>
                <span>Turno: {turma.turno}</span>
                <span className="turmas-serie">Série: {turma.serieAno}</span>
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
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
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
