import React, { useState } from "react";
import "../../styles/CadastroDisciplina.css";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function CadastroDisciplina() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/disciplinas", {
        nome,
        descricao,
      });
      alert("Disciplina cadastrada com sucesso!");
      navigate("/disciplina");
    } catch (error) {
      console.error("Erro ao cadastrar disciplina:", error);
      alert("Erro ao cadastrar disciplina.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="cadastro-disciplina-container">
        <div className="voltar-seta" onClick={() => navigate(-1)}>
           <FaArrowLeft />
        </div>
        <form className="form-disciplina" onSubmit={handleSubmit}>
          <h2>Cadastro de Disciplina</h2>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <button type="submit">Salvar</button>
          

        </form>
      </div>
    </>
  );
} 
