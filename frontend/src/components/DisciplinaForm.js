
import React, { useState, useEffect } from "react";
import "../styles/FormularioModal.css";

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
    <form onSubmit={handleSubmitForm} className="form-disciplina">
      {erroInterno && (
        <p className="error-message" style={{ marginBottom: "15px" }}>
          {erroInterno}
        </p>
      )}

      <div className="form-group">
        {" "}
        <label htmlFor="disciplina-nome-modal">Nome da Disciplina:</label>
        <input
          type="text"
          id="disciplina-nome-modal"
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
          id="disciplina-descricao-modal"
          placeholder="Descrição da Disciplina"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={1000}
          rows={4}
        />
      </div>

      <div className="form-actions-modal">
        {" "}
        <button type="submit" className="btn-salvar-modal">
          {" "}
          {isEditing ? "Salvar Alterações" : "Cadastrar Disciplina"}
        </button>
        <button type="button" onClick={onClose} className="btn-cancelar-modal">
          {" "}
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default DisciplinaForm;
