import React, { useEffect, useState } from "react";
import "../../styles/Disciplina.css";
import Navbar from "../../components/Navbar";
import { buscarDisciplinas, excluirDisciplina } from "../../services/ApiService";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Disciplina() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDisciplinas() {
      try {
        const data = await buscarDisciplinas();
        setDisciplinas(data);
      } catch (error) {
        console.error("Erro ao buscar disciplinas:", error);
      }
    }

    carregarDisciplinas();
  }, []);

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta disciplina?")) {
      try {
        await excluirDisciplina(id);
        setDisciplinas(disciplinas.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Erro ao excluir disciplina:", error);
      }
    }
  };

  const disciplinasFiltradas = disciplinas.filter(
    (d) =>
      d.nome.toLowerCase().includes(nome.toLowerCase()) &&
      d.descricao.toLowerCase().includes(descricao.toLowerCase())
  );

  return (
    <>
      <Navbar onLogout={() => console.log("Logout clicado")} />
      <div className="usuarios-container">
        <div className="usuarios-header">
            <div className="voltar-seta" onClick={() => navigate(-1)}>
                <FaArrowLeft />
            </div>
          <h2>Disciplinas</h2>
          <div className="usuarios-filtros">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            
              <button onClick={() => navigate("/cadastroDisciplina")} className="btn-add">+</button>
            
          </div>
        </div>
        <div className="usuarios-lista">
          {disciplinasFiltradas.length === 0 ? (
            <p className="sem-usuarios">Nenhuma disciplina encontrada.</p>
          ) : (
            disciplinasFiltradas.map((disciplina) => (
              <div className="usuario-row" key={disciplina.id}>
                <div className="usuario-conteudo">
                  <div className="usuario-info">
                    <span><strong>Nome:</strong> {disciplina.nome}</span>
                    <span><strong>Descrição:</strong> {disciplina.descricao}</span>
                  </div>
                  <div className="usuario-acoes">
                    <button onClick={() => navigate(`/editarDisciplina/${disciplina.id}`)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleExcluir(disciplina.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
