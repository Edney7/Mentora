import React, { useEffect, useState, useCallback } from "react";
import "../../styles/secretaria/Disciplina.css";
import Modal from "../../components/Modal";
import DisciplinaForm from "../../components/DisciplinaForm";
import {
  buscarDisciplinas,
  excluirDisciplina,
  cadastrarDisciplina,
  atualizarDisciplina,
  listarProfessoresDaDisciplina,
} from "../../services/ApiService";
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // 1. Importa o toast

export default function Disciplina() {
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [disciplinaParaEditar, setDisciplinaParaEditar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [disciplinaDetalhes, setDisciplinaDetalhes] = useState(null);
  const [professoresDaDisciplina, setProfessoresDaDisciplina] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const navigate = useNavigate();

  const carregarDisciplinas = useCallback(async () => {
    setLoading(true);
    setErroApi("");
    try {
      const data = await buscarDisciplinas();
      setDisciplinas(data || []);
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
      const errorMsg = "Falha ao carregar disciplinas. Verifique sua conexão e tente novamente.";
      toast.error(errorMsg); // Notificação de erro
      setErroApi(errorMsg);
      setDisciplinas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDisciplinas();
  }, [carregarDisciplinas]);

  const handleOpenCreateModal = () => {
    setDisciplinaParaEditar(null);
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (disciplina) => {
    setDisciplinaParaEditar(disciplina);
    setShowEditModal(true);
  };

  const handleOpenDetailModal = async (disciplina) => {
    setDisciplinaDetalhes(disciplina);
    setShowDetailModal(true);
    setLoadingDetails(true);
    try {
      const professores = await listarProfessoresDaDisciplina(disciplina.id);
      setProfessoresDaDisciplina(professores || []);
    } catch (error) {
      console.error("Erro ao buscar professores da disciplina:", error);
      toast.error("Erro ao buscar professores da disciplina."); // Notificação de erro
      setProfessoresDaDisciplina([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setDisciplinaParaEditar(null);
    setProfessoresDaDisciplina([]);
  };

  const handleSaveDisciplina = async (disciplinaData) => {
    setSaving(true);
    try {
      if (disciplinaParaEditar) {
        const disciplinaAtualizada = await atualizarDisciplina(disciplinaParaEditar.id, disciplinaData);
        setDisciplinas(d => d.map(item => item.id === disciplinaAtualizada.id ? disciplinaAtualizada : item));
        toast.success("Disciplina atualizada com sucesso!");
      } else {
        const novaDisciplina = await cadastrarDisciplina(disciplinaData);
        setDisciplinas(prev => [novaDisciplina, ...prev]);
        toast.success("Disciplina cadastrada com sucesso!");
      }
      handleCloseModals();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
      toast.error(`Erro ao salvar disciplina: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleExcluir = async (id, nomeDisciplina) => {
    if (window.confirm(`Tem certeza que deseja excluir a disciplina "${nomeDisciplina}"?`)) {
      try {
        await excluirDisciplina(id);
        setDisciplinas(prev => prev.filter((d) => d.id !== id));
        toast.success(`Disciplina "${nomeDisciplina}" excluída com sucesso!`);
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
        toast.error(`Erro ao excluir disciplina: ${errorMsg}`);
      }
    }
  };

  const disciplinasFiltradas = disciplinas.filter((d) =>
    (d.nome?.toLowerCase() || "").includes(nomeFiltro.toLowerCase())
  );

  if (loading) {
    return <div className="disciplina-container"><p>Carregando disciplinas...</p></div>;
  }

  return (
    <div className="disciplina-container">
      <div className="disciplina-header">
        <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar"><FaArrowLeft /></div>
        <h2>Gerenciamento de Disciplinas</h2>
        <div className="disciplina-filtros">
          <input type="text" placeholder="Filtrar por Nome" value={nomeFiltro} onChange={(e) => setNomeFiltro(e.target.value)} />
          <button onClick={handleOpenCreateModal} className="btn-disciplina" title="Adicionar Nova Disciplina"><FaPlus /></button>
        </div>
      </div>
      {erroApi && <p className="error-message">{erroApi}</p>}
      <div className="disciplina-lista">
        {disciplinasFiltradas.length === 0 && !loading ? (
          <p className="sem-disciplina">Nenhuma disciplina encontrada com os filtros aplicados.</p>
        ) : (
          disciplinasFiltradas.map((disciplina) => (
            <div className="disciplina-row" key={disciplina.id}>
              <div className="disciplina-conteudo">
                <div className="disciplina-info">
                  <span><strong>Nome:</strong> {disciplina.nome}</span>
                  <span><strong>Descrição:</strong> {disciplina.descricao || "Sem descrição"}</span>
                </div>
                <div className="disciplina-acoes">
                  <button onClick={() => handleOpenDetailModal(disciplina)} className="btn-action btn-view" title="Ver Detalhes"><FaEye /></button>
                  <button onClick={() => handleOpenEditModal(disciplina)} title="Editar Disciplina"><FaEdit /></button>
                  <button onClick={() => handleExcluir(disciplina.id, disciplina.nome)} title="Excluir Disciplina"><FaTrash /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Modal isOpen={showCreateModal} onClose={handleCloseModals} title="Cadastrar Nova Disciplina">
        <DisciplinaForm onSubmit={handleSaveDisciplina} onClose={handleCloseModals} isEditing={false} />
      </Modal>
      <Modal isOpen={showEditModal} onClose={handleCloseModals} title={`Editar Disciplina: ${disciplinaParaEditar?.nome || ""}`}>
        {disciplinaParaEditar && <DisciplinaForm onSubmit={handleSaveDisciplina} onClose={handleCloseModals} initialData={disciplinaParaEditar} isEditing={true} />}
      </Modal>
      <Modal isOpen={showDetailModal} onClose={handleCloseModals} title={`Detalhes de: ${disciplinaDetalhes?.nome || ""}`} className="modal-detail-disciplina">
        {loadingDetails ? (
          <p>Carregando professores...</p>
        ) : (
          <div className="modal-detail-disciplina-conteudo">
            <p><strong>Descrição:</strong> {disciplinaDetalhes?.descricao || "Sem descrição"}</p>
            <div style={{ marginTop: "20px" }}>
              <h3>Professores que lecionam esta disciplina:</h3>
              {professoresDaDisciplina.length > 0 ? (
                <ul>
                  {professoresDaDisciplina.map((prof) => <li key={prof.id}>{prof.nomeUsuario}</li>)}
                </ul>
              ) : (
                <p style={{ marginLeft: "10px" }}>Nenhum professor associado.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}