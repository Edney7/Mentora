import React, { useEffect, useState, useCallback } from "react";
import "../../styles/secretaria/Home.css";
// REMOVIDO: A importação e chamada do Navbar não são mais necessárias aqui.
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/Calendario";
import {
  listarTodosOsUsuarios,
  listarProfessoresAtivos,
  listarAlunosAtivos,
  buscarTurmasAtivas,
  listarEventos,
  cadastrarEvento,
} from "../../services/ApiService";
import animacaoHomeSecretaria from "../../assets/animacaoHomeSecretaria.png";
import Modal from "../../components/Modal";

export default function HomeSecretaria() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalProfessores, setTotalProfessores] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalTurmas, setTotalTurmas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const [eventos, setEventos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    titulo: "",
    descricao: "",
    data: "",
    tipo: "",
  });

  const abrirModal = () => setModalAberto(true);
  const fecharModal = () => setModalAberto(false);

  // --- MELHORIA 1: Lógica de carregamento unificada ---
  const carregarDadosDaPagina = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      // Promise.all executa várias chamadas de API em paralelo
      const [
        usuariosData,
        professoresData,
        alunosData,
        turmasData,
        eventosData,
      ] = await Promise.all([
        listarTodosOsUsuarios(),
        listarProfessoresAtivos(),
        listarAlunosAtivos(),
        buscarTurmasAtivas(),
        listarEventos(),
      ]);

      // Atualiza os totais
      setTotalUsuarios(usuariosData?.length || 0);
      setTotalProfessores(professoresData?.length || 0);
      setTotalAlunos(alunosData?.length || 0);
      setTotalTurmas(turmasData?.length || 0);

      // Atualiza e formata os eventos
      const formatados = eventosData.map((ev) => ({
        title: ev.titulo,
        date: ev.data,
      }));
      setEventos(formatados);
    } catch (error) {
      console.error("Erro ao carregar dados da página:", error);
      setErro("Falha ao carregar dados do painel. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosDaPagina();
  }, [carregarDadosDaPagina]);

  const adicionarEvento = async () => {
    if (
      !novoEvento.titulo ||
      !novoEvento.descricao ||
      !novoEvento.data ||
      !novoEvento.tipo
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    // --- MELHORIA 2: Pegando o ID do usuário logado dinamicamente ---
    const idSecretaria = localStorage.getItem("userId");
    if (!idSecretaria) {
      alert("Erro: Usuário não identificado. Faça o login novamente.");
      return;
    }
    // -----------------------------------------------------------------

    try {
      await cadastrarEvento({
        titulo: novoEvento.titulo,
        descricao: novoEvento.descricao,
        data: novoEvento.data,
        tipo: novoEvento.tipo,
        idSecretaria: parseInt(idSecretaria, 10), // Converte o ID para número
        idCalendario: 1, // TODO: Este ID também deveria ser dinâmico
      });
      setNovoEvento({ titulo: "", descricao: "", data: "", tipo: "" });
      fecharModal();
      carregarDadosDaPagina(); // Recarrega todos os dados, incluindo os eventos
    } catch (err) {
      console.error("Erro ao cadastrar evento:", err);
      alert("Erro ao cadastrar evento.");
    }
  };

  if (loading) {
    // A tela de loading agora não tem mais o Navbar
    return (
      <div
        className="home-secretaria-container"
        style={{ textAlign: "center", paddingTop: "50px" }}
      >
        <p>Carregando dados do painel...</p>
      </div>
    );
  }

  return (
    // A tela principal também não tem mais o Navbar
    <div className="home-secretaria-container">
      <main className="main-content">
        <div className="card-info">
          <div className="card-info-item">
            <h3>Total de Usuários</h3>
            <p>{totalUsuarios}</p>
          </div>
          <div className="card-info-item">
            <h3>Professores Ativos</h3>
            <p>{totalProfessores}</p>
          </div>
          <div className="card-info-item">
            <h3>Alunos Matriculados</h3>
            <p>{totalAlunos}</p>
          </div>
          <div className="card-info-item">
            <h3>Total de Turmas</h3>
            <p>{totalTurmas}</p>
          </div>
        </div>

        <div
          onClick={() => navigate("/secretaria/usuarios")}
          className="top-card"
        >
          <h2>Gerenciar Usuarios</h2>
          <img
            src={animacaoHomeSecretaria}
            alt="Estudante com livros"
            className="top-img"
          />
        </div>
        <div className="button-grid">
          <button
            onClick={() => navigate("/secretaria/ausenciaProfessor")}
            className="btn"
          >
            Ausência do Professor
          </button>
          <button
            onClick={() => navigate("/secretaria/notasPresencasAlunos")}
            className="btn"
          >
            Presença e falta
          </button>
        </div>
        <div className="button-grid">
          <button
            onClick={() => navigate("/secretaria/turmas")}
            className="btn"
          >
            Gerenciar Turmas
          </button>
          <button
            onClick={() => navigate("/secretaria/disciplina")}
            className="btn"
          >
            Gerenciar Disciplinas
          </button>
        </div>
      </main>

      {erro && (
        <p
          className="error-message"
          style={{ textAlign: "center", width: "100%", padding: "10px 0" }}
        >
          {erro}
        </p>
      )}

      <section className="event-panel">
        <div className="event-card branco">
          <div className="calendar-container">
            <Calendar eventos={eventos} />
          </div>
        </div>

        <div className="event-group">
          <div className="event-card verde">
            <span>Próximo Feriado</span>
            <span className="hora">xx/xx</span>
          </div>
          <button className="event-card laranja" onClick={abrirModal}>
            <h2>Cadastrar Eventos</h2>
          </button>

          <Modal
            isOpen={modalAberto}
            onRequestClose={fecharModal}
            contentLabel="Cadastrar Evento"
            style={{
              content: {
                maxWidth: "400px",
                margin: "auto",
                borderRadius: "10px",
                padding: "20px",
                fontFamily: "arial",
                color: "orange", // Este estilo inline poderia ir para um arquivo CSS
              },
            }}
          >
            <h3>Cadastrar Evento</h3>
            <input
              type="text"
              name="titulo"
              placeholder="Título"
              value={novoEvento.titulo}
              onChange={(e) =>
                setNovoEvento((prev) => ({ ...prev, titulo: e.target.value }))
              }
              style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
            />
            <input
              type="text"
              name="descricao"
              placeholder="Descrição"
              value={novoEvento.descricao}
              onChange={(e) =>
                setNovoEvento((prev) => ({
                  ...prev,
                  descricao: e.target.value,
                }))
              }
              style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
            />
            <input
              type="date"
              name="data"
              value={novoEvento.data}
              onChange={(e) =>
                setNovoEvento((prev) => ({ ...prev, data: e.target.value }))
              }
              style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
            />
            <input
              type="text"
              name="tipo"
              placeholder="Tipo"
              value={novoEvento.tipo}
              onChange={(e) =>
                setNovoEvento((prev) => ({ ...prev, tipo: e.target.value }))
              }
              style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
            />
            <button onClick={adicionarEvento} style={{ marginRight: "10px" }}>
              Salvar
            </button>
            <button onClick={fecharModal}>Cancelar</button>
          </Modal>
        </div>
      </section>
    </div>
  );
}
