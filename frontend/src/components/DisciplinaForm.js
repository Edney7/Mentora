// src/components/DisciplinaForm.jsx
import React, { useState, useEffect } from "react";
import "../styles/FormularioModal.css";
// Importe aqui o CSS que você vai criar ou adaptar (ex: import './FormularioModal.css';)

const DisciplinaForm = ({ onSubmit, onClose, initialData, isEditing }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroInterno, setErroInterno] = useState("");

  useEffect(() => {
    if (isEditing && initialData) {
      setNome(initialData.nome || "");
      setDescricao(initialData.descricao || "");
    } else {
      setNome("");
      setDescricao("");
    }
  }, [initialData, isEditing]);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setErroInterno("");
    if (!nome.trim()) {
      setErroInterno("O nome da disciplina é obrigatório.");
      return;
    }
    onSubmit({
      id: isEditing && initialData ? initialData.id : undefined,
      nome,
      descricao,
    });
  };

  return (
    // Aplicando a classe principal do seu CSS de formulário
    <form onSubmit={handleSubmitForm} className="form-disciplina">
      {/* O título "Editar Disciplina" ou "Cadastrar Nova Disciplina" agora virá do Modal */}
      {erroInterno && (
        <p className="error-message" style={{ marginBottom: "15px" }}>
          {erroInterno}
        </p>
      )}

      <div className="form-group">
        {" "}
        {/* Adicionando form-group para consistência, se necessário */}
        <label htmlFor="disciplina-nome-modal">Nome da Disciplina:</label>
        <input
          type="text"
          id="disciplina-nome-modal" // ID único para o modal
          placeholder="Nome da Disciplina"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="disciplina-descricao-modal">
          Descrição (Opcional):
        </label>
        <textarea
          id="disciplina-descricao-modal" // ID único para o modal
          placeholder="Descrição da Disciplina"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={1000}
          rows={4}
        />
      </div>

      <div className="form-actions-modal">
        {" "}
        {/* Classe diferente para ações no modal, se precisar de estilo específico */}
        <button type="submit" className="btn-salvar-modal">
          {" "}
          {/* Classe específica para o botão salvar no modal */}
          {isEditing ? "Salvar Alterações" : "Cadastrar Disciplina"}
        </button>
        <button type="button" onClick={onClose} className="btn-cancelar-modal">
          {" "}
          {/* Classe específica para o botão cancelar no modal */}
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default DisciplinaForm;
