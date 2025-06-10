import React, { useEffect, useState, useCallback } from "react";
import "../../styles/Disciplina.css"; 
import Navbar from "../../components/Navbar";
import Modal from "../../components/Modal";
import DisciplinaForm from "../../components/DisciplinaForm"; 
import { 
    buscarDisciplinas, 
    excluirDisciplina, 
    cadastrarDisciplina, 
    atualizarDisciplina 
} from "../../services/ApiService";
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Disciplina() {
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [descricaoFiltro, setDescricaoFiltro] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [disciplinaParaEditar, setDisciplinaParaEditar] = useState(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const carregarDisciplinas = useCallback(async () => {
    setLoading(true);
    setErroApi("");
    try {
      const data = await buscarDisciplinas();
      setDisciplinas(data || []);
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
      setErroApi("Falha ao carregar disciplinas. Verifique sua conexão e tente novamente.");
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

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setDisciplinaParaEditar(null); 
    setErroApi(""); 
  };

  const handleSaveDisciplina = async (disciplinaData) => {
    setSaving(true);
    setErroApi("");
    try {
      if (disciplinaParaEditar) {
        await atualizarDisciplina(disciplinaParaEditar.id, disciplinaData);
        alert("Disciplina atualizada com sucesso!");
      } else {
        await cadastrarDisciplina(disciplinaData);
        alert("Disciplina cadastrada com sucesso!");
      }
      handleCloseModals();
      carregarDisciplinas(); 
    } catch (error) {
      console.error("Erro ao salvar disciplina:", error);
      const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
      setErroApi(`Erro ao salvar disciplina: ${errorMsg}`); 
      return Promise.reject(error); 
    } finally {
      setSaving(false);
    }
  };

  const handleExcluir = async (id, nomeDisciplina) => {
    if (window.confirm(`Tem certeza que deseja excluir a disciplina "${nomeDisciplina}"?`)) {
      try {
        await excluirDisciplina(id);
        setDisciplinas(prevDisciplinas => prevDisciplinas.filter((d) => d.id !== id));
        alert(`Disciplina "${nomeDisciplina}" excluída com sucesso!`);
      } catch (error) {
        console.error("Erro ao excluir disciplina:", error);
        const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
        alert(`Erro ao excluir disciplina: ${errorMsg}`);
      }
    }
  };

  const disciplinasFiltradas = disciplinas.filter(
    (d) =>
      (d.nome?.toLowerCase() || "").includes(nomeFiltro.toLowerCase()) &&
      (d.descricao?.toLowerCase() || "").includes(descricaoFiltro.toLowerCase())
  );

  if (loading && !showCreateModal && !showEditModal) {
    return (
      <>
        <Navbar />
        <div className="usuarios-container">
          <p>Carregando disciplinas...</p>
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
          <h2>Gerenciamento de Disciplinas</h2>
          <div className="usuarios-filtros">
            <input
              type="text"
              placeholder="Filtrar por Nome"
              value={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por Descrição"
              value={descricaoFiltro}
              onChange={(e) => setDescricaoFiltro(e.target.value)}
            />
            <button 
              onClick={handleOpenCreateModal} 
              className="btn-add" 
              title="Adicionar Nova Disciplina"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {erroApi && !showCreateModal && !showEditModal && <p className="error-message">{erroApi}</p>} 

        <div className="usuarios-lista">
          {disciplinasFiltradas.length === 0 && !loading ? (
            <p className="sem-usuarios">Nenhuma disciplina encontrada com os filtros aplicados.</p>
          ) : (
            disciplinasFiltradas.map((disciplina) => (
              <div className="usuario-row" key={disciplina.id}>
                <div className="usuario-conteudo">
                  <div className="usuario-info">
                    <span><strong>Nome:</strong> {disciplina.nome}</span>
                    <span><strong>Descrição:</strong> {disciplina.descricao || "Sem descrição"}</span>
                  </div>
                  <div className="usuario-acoes">
                  <button onClick={() =>
                   navigate(`/secretaria/disciplina/detalhes/${disciplina.id}`)}
                   className="btn-action btn-view"
                   title="Ver Detalhes e Gerenciar">
                    <FaEye />
                    </button>         
                    <button 
                      onClick={() => handleOpenEditModal(disciplina)}
                      title="Editar Disciplina"
                    >
                      <FaEdit />
                    </button>
                    <button onClick={() => handleExcluir(disciplina.id, disciplina.nome)} title="Excluir Disciplina">
                      <FaTrash />
                    </button>
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
        title="Cadastrar Nova Disciplina"
      >
        <DisciplinaForm 
          onSubmit={handleSaveDisciplina} 
          onClose={handleCloseModals}
          isEditing={false} 
        />
        {saving === false && erroApi && showCreateModal && <p className="error-message" style={{marginTop: '15px'}}>{erroApi}</p>}
      </Modal>

      <Modal 
        isOpen={showEditModal} 
        onClose={handleCloseModals} 
        title={`Editar Disciplina: ${disciplinaParaEditar?.nome || ''}`}
      >
        {disciplinaParaEditar && ( 
          <DisciplinaForm 
            onSubmit={handleSaveDisciplina} 
            onClose={handleCloseModals}
            initialData={disciplinaParaEditar}
            isEditing={true}
          />
        )}
        {saving === false && erroApi && showEditModal && <p className="error-message" style={{marginTop: '15px'}}>{erroApi}</p>}
      </Modal>
    </>
  );
}
