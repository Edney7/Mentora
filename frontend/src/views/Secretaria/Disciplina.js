import React, { useEffect, useState, useCallback } from "react";
import "../../styles/Disciplina.css"; // Ou seu CSS de lista genérico
import Navbar from "../../components/Navbar";
import Modal from "../../components/Modal"; // Importar o Modal
import DisciplinaForm from "../../components/DisciplinaForm"; // Importar o Formulário
import { 
    buscarDisciplinas, 
    excluirDisciplina, 
    cadastrarDisciplina, // Adicionar ao ApiService.js
    atualizarDisciplina  // Adicionar ao ApiService.js
} from "../../services/ApiService";
import { FaEdit, FaTrash, FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from 'react-toastify';

export default function Disciplina() {
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [descricaoFiltro, setDescricaoFiltro] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroApi, setErroApi] = useState("");

  // Estados para os modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [disciplinaParaEditar, setDisciplinaParaEditar] = useState(null); // Guarda a disciplina a ser editada
  const [saving, setSaving] = useState(false); // Para feedback no botão de salvar do modal

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
    setDisciplinaParaEditar(null); // Garante que não há dados pré-preenchidos
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (disciplina) => {
    setDisciplinaParaEditar(disciplina);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setDisciplinaParaEditar(null); // Limpa a disciplina em edição
    setErroApi(""); // Limpa erros da API ao fechar modal
  };

  const handleSaveDisciplina = async (disciplinaData) => {
    setSaving(true);
    setErroApi("");
    try {
      if (disciplinaParaEditar) { // Modo Edição
        await atualizarDisciplina(disciplinaParaEditar.id, disciplinaData);
        // toast.success("Disciplina atualizada com sucesso!");
        alert("Disciplina atualizada com sucesso!");
      } else { // Modo Criação
        await cadastrarDisciplina(disciplinaData);
        // toast.success("Disciplina cadastrada com sucesso!");
        alert("Disciplina cadastrada com sucesso!");
      }
      handleCloseModals();
      carregarDisciplinas(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao salvar disciplina:", error);
      const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
      setErroApi(`Erro ao salvar disciplina: ${errorMsg}`); // Mostra erro dentro do modal ou na página
      // toast.error(`Erro ao salvar disciplina: ${errorMsg}`);
      // Não fechar o modal em caso de erro para o usuário corrigir
      return Promise.reject(error); // Permite que o form saiba que houve erro
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
        // toast.success(`Disciplina "${nomeDisciplina}" excluída com sucesso!`);
      } catch (error) {
        console.error("Erro ao excluir disciplina:", error);
        const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
        alert(`Erro ao excluir disciplina: ${errorMsg}`);
        // toast.error(`Erro ao excluir disciplina: ${errorMsg}`);
      }
    }
  };

  const disciplinasFiltradas = disciplinas.filter(
    (d) =>
      (d.nome?.toLowerCase() || "").includes(nomeFiltro.toLowerCase()) &&
      (d.descricao?.toLowerCase() || "").includes(descricaoFiltro.toLowerCase())
  );

  if (loading && !showCreateModal && !showEditModal) { // Só mostra loading principal se nenhum modal estiver aberto
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
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
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
              onClick={handleOpenCreateModal} // Abre o modal de criação
              className="btn-add" 
              title="Adicionar Nova Disciplina"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {erroApi && !showCreateModal && !showEditModal && <p className="error-message">{erroApi}</p>} {/* Mostra erro da API principal */}

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
                    <button 
                      onClick={() => handleOpenEditModal(disciplina)} // Abre o modal de edição
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

      {/* Modal para Criar Disciplina */}
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
        {/* Exibir erro da API dentro do modal se saving falhou */}
        {saving === false && erroApi && showCreateModal && <p className="error-message" style={{marginTop: '15px'}}>{erroApi}</p>}
      </Modal>

      {/* Modal para Editar Disciplina */}
      <Modal 
        isOpen={showEditModal} 
        onClose={handleCloseModals} 
        title={`Editar Disciplina: ${disciplinaParaEditar?.nome || ''}`}
      >
        {disciplinaParaEditar && ( // Garante que disciplinaParaEditar não é null
          <DisciplinaForm 
            onSubmit={handleSaveDisciplina} 
            onClose={handleCloseModals}
            initialData={disciplinaParaEditar}
            isEditing={true}
          />
        )}
         {/* Exibir erro da API dentro do modal se saving falhou */}
        {saving === false && erroApi && showEditModal && <p className="error-message" style={{marginTop: '15px'}}>{erroApi}</p>}
      </Modal>
    </>
  );
}
