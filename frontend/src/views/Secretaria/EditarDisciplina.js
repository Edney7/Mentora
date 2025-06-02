import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/CadastroDisciplina.css"; 
import Navbar from "../../components/Navbar"; 
import { FaArrowLeft } from "react-icons/fa"; 

export default function EditarDisciplina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disciplina, setDisciplina] = useState({ nome: "", descricao: "" });

  useEffect(() => {
    axios.get(`http://localhost:8080/disciplinas/${id}`)
      .then(res => setDisciplina(res.data))
      .catch(err => console.error("Erro ao buscar disciplina", err));
  }, [id]);

  const handleChange = (e) => {
    setDisciplina({ ...disciplina, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/disciplinas/${id}`, disciplina)
      .then(() => {
        alert("Disciplina atualizada!");
        navigate("/disciplina");
      })
      .catch(err => console.error("Erro ao atualizar:", err));
  };

  return (
    <>
    <Navbar />
    <div className="cadastro-disciplina-container">
     <div className="voltar-seta" onClick={() => navigate(-1)}>
      <FaArrowLeft />
      </div>
    <form className="form-disciplina" onSubmit={handleSubmit}>
      <h2>Editar Disciplina</h2>
      <input name="nome" value={disciplina.nome} onChange={handleChange} />
      <input name="descricao" value={disciplina.descricao} onChange={handleChange} />
      <button type="submit">Salvar</button>
    </form>
    </div>
    </>
  );
}
