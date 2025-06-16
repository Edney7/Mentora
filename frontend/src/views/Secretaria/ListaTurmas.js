import React, { useEffect, useState, useCallback } from "react";
import "../../styles/secretaria/Turma.css";
import Modal from "../../components/Modal";
import TurmaForm from "../../components/TurmaForm";
import {
  buscarTodasAsTurmas,
  desativarTurma,
  reativarTurma,
  cadastrarTurma,
  atualizarTurma,
} from "../../services/ApiService";
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaEye, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ListaTurmas() {
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [turnoFiltro, setTurnoFiltro] = useState("");
  const [serieAnoFiltro, setSerieAnoFiltro] = useState("");
  const [anoLetivoFiltro, setAnoLetivoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("ATIVAS");
  const [todasAsTurmasDoBackend, setTodasAsTurmasDoBackend] = useState([]);
  const [turmasExibidas, setTurmasExibidas] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const navigate = useNavigate();

  const carregarTurmasAPI = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const data = await buscarTodasAsTurmas();
      setTodasAsTurmasDoBackend(data || []);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      setErro("Falha ao carregar turmas. Verifique a conexão ou tente mais tarde.");
      setTodasAsTurmasDoBackend([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTurmasAPI();
  }, [carregarTurmasAPI]);

  useEffect(() => {
    let turmasProcessadas = [...todasAsTurmasDoBackend];
    if (statusFiltro === "ATIVAS") {
      turmasProcessadas = turmasProcessadas.filter(t => t.ativa === true);
    } else if (statusFiltro === "INATIVAS") {
      turmasProcessadas = turmasProcessadas.filter(t => t.ativa === false);
    }

    const filtradas = turmasProcessadas.filter((turma) => {
      const nomeMatch = turma.nome?.toLowerCase().includes(nomeFiltro.toLowerCase());
      const turnoMatch = turnoFiltro ? (turma.turno?.toLowerCase() || "") === turnoFiltro.toLowerCase() : true;
      const serieAnoMatch = (turma.serieAno?.toLowerCase() || "").includes(serieAnoFiltro.toLowerCase());
      const anoLetivoMatch = anoLetivoFiltro ? (turma.anoLetivo?.toString() || "").includes(anoLetivoFiltro) : true;
      return nomeMatch && turnoMatch && serieAnoMatch && anoLetivoMatch;
    });
    setTurmasExibidas(filtradas);
  }, [todasAsTurmasDoBackend, nomeFiltro, turnoFiltro, serieAnoFiltro, anoLetivoFiltro, statusFiltro]);

  const handleOpenCreateModal = () => {
    setTurmaSelecionada(null);
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (turma) => {
    setTurmaSelecionada(turma);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setTurmaSelecionada(null);
    setErro("");
  };

  const handleSaveTurma = async (turmaData) => {
    setSaving(true);
    setErro("");
    try {
      if (turmaSelecionada && turmaSelecionada.id) {
        const turmaAtualizada = await atualizarTurma(turmaSelecionada.id, turmaData);
        setTodasAsTurmasDoBackend(prev => prev.map(t => t.id === turmaAtualizada.id ? turmaAtualizada : t));
        alert("Turma atualizada com sucesso!");
      } else {
        const novaTurma = await cadastrarTurma(turmaData);
        setTodasAsTurmasDoBackend(prev => [novaTurma, ...prev]);
        alert("Turma cadastrada com sucesso!");
      }
      handleCloseModals();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
      setErro(`Erro ao salvar turma: ${errorMsg}`);
      return Promise.reject(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDesativar = async (id, nomeTurma) => {
    if (window.confirm(`Tem certeza que deseja DESATIVAR a turma "${nomeTurma}"?`)) {
      try {
        await desativarTurma(id);
        setTodasAsTurmasDoBackend(prev => prev.map(t => t.id === id ? { ...t, ativa: false } : t));
        alert("Turma desativada com sucesso!");
      } catch (error) {
        alert(`Erro ao desativar turma: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleReativar = async (id, nomeTurma) => {
    if (window.confirm(`Tem certeza que deseja REATIVAR a turma "${nomeTurma}"?`)) {
      try {
        await reativarTurma(id);
        setTodasAsTurmasDoBackend(prev => prev.map(t => t.id === id ? { ...t, ativa: true } : t));
        alert("Turma reativada com sucesso!");
      } catch (error) {
        alert(`Erro ao reativar turma: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  if (loading && !showCreateModal && !showEditModal) {
    return <div className="turmas-container"><p>Carregando turmas...</p></div>;
  }

  return (
    <div className="turmas-container">
      <div className="turmas-header">
        <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar"><FaArrowLeft /></div>
        <h2>Gerenciamento de Turmas</h2>
      </div>
      {erro && !showCreateModal && !showEditModal && <p className="error-message">{erro}</p>}
      <div className="turmas-filtros">
        <input type="text" placeholder="Nome da Turma" value={nomeFiltro} onChange={(e) => setNomeFiltro(e.target.value)} className="turmas-filtro nome"/>
        <input type="text" placeholder="Série/Ano" value={serieAnoFiltro} onChange={(e) => setSerieAnoFiltro(e.target.value)} className="turmas-filtro pequeno" />
        <input type="text" placeholder="Ano Letivo" value={anoLetivoFiltro} onChange={(e) => setAnoLetivoFiltro(e.target.value)} className="turmas-filtro pequeno" />
        <select value={turnoFiltro} onChange={(e) => setTurnoFiltro(e.target.value)} className="turmas-filtro select">
          <option value="">Todos os Turnos</option>
          <option value="Manhã">Manhã</option>
          <option value="Tarde">Tarde</option>
          <option value="Noite">Noite</option>
          <option value="Integral">Integral</option>
        </select>
        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} className="turmas-filtro select">
          <option value="ATIVAS">Apenas Ativas</option>
          <option value="INATIVAS">Apenas Inativas</option>
          <option value="TODAS">Todas</option>
        </select>
        <button onClick={handleOpenCreateModal} className="btn-turmas" title="Adicionar Nova Turma"><FaPlus /></button>
      </div>
      <div className="turmas-lista">
        {turmasExibidas.length === 0 && !loading ? (
          <p className="sem-turmas">Nenhuma turma encontrada com os filtros aplicados.</p>
        ) : (
          turmasExibidas.map((turma) => (
            <div className="turmas-row" key={turma.id}>
              <div className={`turmas-borda ${turma.ativa ? "turma-ativa" : "turma-inativa"}`}></div>
              <div className="turmas-conteudo">
                <div className="turmas-info">
                  <span><strong>Nome:</strong> {turma.nome}</span>
                  <span><strong>Turno:</strong> {turma.turno || "-"}</span>
                  <span><strong>Série/Ano:</strong> {turma.serieAno || "-"}</span>
                  <span><strong>Ano Letivo:</strong> {turma.anoLetivo || "-"}</span>
                  <span><strong>Status:</strong> <span className={turma.ativa ? "status-ativo" : "status-inativo"}>{turma.ativa ? "Ativa" : "Inativa"}</span></span>
                </div>
                <div className="turmas-acoes">
                  <button onClick={() => navigate(`/secretaria/turmas/detalhes/${turma.id}`)} className="btn-action btn-view" title="Ver Detalhes e Gerenciar"><FaEye /></button>
                  <button onClick={() => handleOpenEditModal(turma)} className="btn-action btn-edit" title="Editar Turma"><FaEdit /></button>
                  {turma.ativa ? (
                    <button onClick={() => handleDesativar(turma.id, turma.nome)} className="btn-action btn-delete" title="Desativar Turma"><FaTrash /></button>
                  ) : (
                    <button onClick={() => handleReativar(turma.id, turma.nome)} className="btn-action btn-reactivate" title="Reativar Turma"><FaRedo /></button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Modal isOpen={showCreateModal} onClose={handleCloseModals} title="Cadastrar Nova Turma" className="modal-turma">
        <TurmaForm onSubmit={handleSaveTurma} onClose={handleCloseModals} isEditing={false} className="modal-turma-form" />
        {saving === false && erro && showCreateModal && <p className="error-message">{erro}</p>}
      </Modal>
      <Modal isOpen={showEditModal} onClose={handleCloseModals} title={`Editar Turma: ${turmaSelecionada?.nome || ""}`}>
        {turmaSelecionada && <TurmaForm onSubmit={handleSaveTurma} onClose={handleCloseModals} initialData={turmaSelecionada} isEditing={true} />}
        {saving === false && erro && showEditModal && <p className="error-message">{erro}</p>}
      </Modal>
    </div>
  );
}