// Caminho de exemplo: src/views/Secretaria/Turma/ListaTurmas.jsx
// Ajuste os caminhos de importação conforme a sua estrutura de pastas.

import React, { useEffect, useState, useCallback } from "react";
import "../../styles/ListaUsuario.css"; // Usando o mesmo CSS
import Navbar from "../../components/Navbar"; 
import Modal from "../../components/Modal"; // Modal ainda é usado para Criar/Editar
import TurmaForm from "../../components/TurmaForm"; // Para os modais de Criar/Editar

import { 
    buscarTurmasAtivas, 
    desativarTurma,     
    reativarTurma,
    cadastrarTurma,
    atualizarTurma
} from "../../services/ApiService"; 
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaEye, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ListaTurmas() {
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [turnoFiltro, setTurnoFiltro] = useState("");
  const [serieAnoFiltro, setSerieAnoFiltro] = useState("");
  const [anoLetivoFiltro, setAnoLetivoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("ATIVAS");

  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [saving, setSaving] = useState(false);

  // Estados para os modais de Criar e Editar
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // turmaSelecionada ainda é usada para o modal de edição
  const [turmaSelecionada, setTurmaSelecionada] = useState(null); 

  const navigate = useNavigate();

  const carregarTurmas = useCallback(async () => {
    setLoading(true);
    setErroApi("");
    try {
      let dataRecebida;
      // Ajuste esta lógica se sua API `buscarTurmasAtivas` puder receber o statusFiltro
      if (statusFiltro === "INATIVAS") {
        const todasAsTurmas = await buscarTurmasAtivas(); // Idealmente, buscaria todas e filtraria, ou API com filtro
        dataRecebida = todasAsTurmas.filter(t => !t.ativa);
      } else if (statusFiltro === "TODAS") {
        const todasAsTurmas = await buscarTurmasAtivas(); // Idealmente, buscaria todas e filtraria
        dataRecebida = todasAsTurmas;
      } else { // ATIVAS
        dataRecebida = await buscarTurmasAtivas();
      }
      setTurmas(dataRecebida || []);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      setErroApi("Falha ao carregar turmas.");
      setTurmas([]);
    } finally {
      setLoading(false);
    }
  }, [statusFiltro]); 

  useEffect(() => {
    carregarTurmas();
  }, [carregarTurmas]);

  const handleOpenCreateModal = () => {
    setTurmaSelecionada(null); // Limpa para garantir que é modo de criação
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (turma) => {
    setTurmaSelecionada(turma);
    setShowEditModal(true);
  };

  // A função handleOpenDetalhesModal e o estado showDetalhesModal foram removidos.
  // A navegação para detalhes será direta.

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    // setShowDetalhesModal(false); // Removido
    setTurmaSelecionada(null);
    setErroApi(""); 
  };

  const handleSaveTurma = async (turmaData) => {
    setSaving(true);
    setErroApi("");
    try {
      if (turmaSelecionada && turmaSelecionada.id) { 
        await atualizarTurma(turmaSelecionada.id, turmaData);
        alert("Turma atualizada com sucesso!");
      } else { 
        await cadastrarTurma(turmaData);
        alert("Turma cadastrada com sucesso!");
      }
      handleCloseModals();
      carregarTurmas(); 
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
      setErroApi(`Erro ao salvar turma: ${errorMsg}`);
      return Promise.reject(error); 
    } finally {
      setSaving(false);
    }
  };

  const handleDesativar = async (id, nomeTurma) => {
    if (window.confirm(`Tem certeza que deseja DESATIVAR a turma "${nomeTurma}"?`)) {
      try {
        await desativarTurma(id);
        setTurmas(prevTurmas => 
          prevTurmas.map(t => t.id === id ? { ...t, ativa: false } : t)
        );
        alert(`Turma "${nomeTurma}" desativada com sucesso.`);
      } catch (error) {
        console.error("Erro ao desativar turma:", error);
        alert(`Erro ao desativar turma: ${error.response?.data?.message || error.message || "Tente novamente."}`);
      }
    }
  };

  const handleReativar = async (id, nomeTurma) => {
    if (window.confirm(`Tem certeza que deseja REATIVAR a turma "${nomeTurma}"?`)) {
      try {
        await reativarTurma(id);
        setTurmas(prevTurmas => 
          prevTurmas.map(t => t.id === id ? { ...t, ativa: true } : t)
        );
        alert(`Turma "${nomeTurma}" reativada com sucesso.`);
      } catch (error) {
        console.error("Erro ao reativar turma:", error);
        alert(`Erro ao reativar turma: ${error.response?.data?.message || error.message || "Tente novamente."}`);
      }
    }
  };

  const turmasFiltradas = turmas.filter((turma) => {
    const nomeMatch = turma.nome?.toLowerCase().includes(nomeFiltro.toLowerCase());
    const turnoMatch = turnoFiltro ? (turma.turno?.toLowerCase() || "") === turnoFiltro.toLowerCase() : true;
    const serieAnoMatch = (turma.serieAno?.toLowerCase() || "").includes(serieAnoFiltro.toLowerCase());
    const anoLetivoMatch = anoLetivoFiltro ? (turma.anoLetivo?.toString() || "").includes(anoLetivoFiltro) : true;
    
    let statusMatchEval = true;
    if (statusFiltro === "ATIVAS") {
        statusMatchEval = turma.ativa === true;
    } else if (statusFiltro === "INATIVAS") {
        statusMatchEval = turma.ativa === false;
    }
    return nomeMatch && turnoMatch && serieAnoMatch && anoLetivoMatch && statusMatchEval;
  });

  // Oculta o loading principal se algum modal estiver aberto
  if (loading && !showCreateModal && !showEditModal) { 
    return (
      <>
        <Navbar />
        <div className="usuarios-container">
          <p>Carregando turmas...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="usuarios-container">
        <div className="usuarios-header">
          <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar">
            <FaArrowLeft />
          </div>
          <h2>GERENCIAMENTO DE TURMAS</h2>
          <div className="usuarios-filtros">
            {/* Filtros como antes */}
            <input
              type="text"
              placeholder="Nome da Turma"
              value={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}
            />
            <select value={turnoFiltro} onChange={(e) => setTurnoFiltro(e.target.value)}>
              <option value="">Todos os Turnos</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
              <option value="Integral">Integral</option>
            </select>
            <input
              type="text"
              placeholder="Série/Ano"
              value={serieAnoFiltro}
              onChange={(e) => setSerieAnoFiltro(e.target.value)}
            />
            <input
              type="text"
              placeholder="Ano Letivo"
              value={anoLetivoFiltro}
              onChange={(e) => setAnoLetivoFiltro(e.target.value)}
            />
            <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
              <option value="ATIVAS">Apenas Ativas</option>
              <option value="INATIVAS">Apenas Inativas</option>
              <option value="TODAS">Todas</option> 
            </select>
            <button 
              onClick={handleOpenCreateModal} // Abre o modal de criação
              className="btn-add" 
              title="Cadastrar Nova Turma"
            >
              <FaPlus/>
            </button>
          </div>
        </div>

        {erroApi && !showCreateModal && !showEditModal && 
          <p className="error-message">{erroApi}</p>
        }

        <div className="usuarios-lista">
          {turmasFiltradas.length === 0 && !loading ? (
            <p className="sem-usuarios">Nenhuma turma encontrada com os filtros aplicados.</p>
          ) : (
            turmasFiltradas.map((turma) => (
              <div className="usuario-row" key={turma.id}>
                <div
                  className={`usuario-borda ${turma.ativa ? 'turma-ativa' : 'turma-inativa'}`}
                ></div>
                <div className="usuario-conteudo">
                  <div className="usuario-info">
                    <span><strong>Nome:</strong> {turma.nome}</span>
                    <span><strong>Turno:</strong> {turma.turno || "-"}</span>
                    <span><strong>Série/Ano:</strong> {turma.serieAno || "-"}</span>
                    <span><strong>Ano Letivo:</strong> {turma.anoLetivo || "-"}</span>
                    <span><strong>Status:</strong> <span className={turma.ativa ? 'status-ativo' : 'status-inativo'}>{turma.ativa ? "Ativa" : "Inativa"}</span></span>
                  </div>
                  <div className="usuario-acoes">
                    <button 
                        onClick={() => navigate(`/secretaria/turmas/detalhes/${turma.id}`)} 
                        title="Ver Detalhes"
                        className="btn-action btn-view" 
                    >
                      <FaEye />
                    </button>
                    <button 
                        onClick={() => handleOpenEditModal(turma)} 
                        title="Editar Turma"
                        className="btn-action btn-edit" 
                    >
                      <FaEdit />
                    </button>
                    {turma.ativa ? (
                      <button onClick={() => handleDesativar(turma.id, turma.nome)} title="Desativar Turma" className="btn-action btn-delete">
                        <FaTrash />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleReativar(turma.id, turma.nome)} 
                        title="Reativar Turma"
                        className="btn-action btn-reactivate"
                      >
                        <FaRedo /> 
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>


      <Modal 
        isOpen={showCreateModal} 
        onClose={handleCloseModals} 
        title="Cadastrar Nova Turma"
      >
        <TurmaForm 
          onSubmit={handleSaveTurma} 
          onClose={handleCloseModals}
          isEditing={false} 
        />
        {saving === false && erroApi && showCreateModal && <p className="error-message" style={{marginTop: '15px'}}>{erroApi}</p>}
      </Modal>


      <Modal 
        isOpen={showEditModal} 
        onClose={handleCloseModals} 
        title={`Editar Turma: ${turmaSelecionada?.nome || ''}`}
      >
        {turmaSelecionada && (
          <TurmaForm 
            onSubmit={handleSaveTurma} 
            onClose={handleCloseModals}
            initialData={turmaSelecionada}
            isEditing={true}
          />
        )}
        {saving === false && erroApi && showEditModal && <p className="error-message" style={{marginTop: '15px'}}>{erroApi}</p>}
      </Modal>

    </>
  );
}
