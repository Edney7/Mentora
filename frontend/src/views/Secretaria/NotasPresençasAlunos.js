import React, { useEffect, useState } from "react";
import { listarTodasNotas, listarTodasFaltas } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import "../../styles/NotasPresencasAlunos.css";

export default function NotasPresencasAluno() {
  const [notas, setNotas] = useState([]);
  const [faltas, setFaltas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      try {
        const notasData = await listarTodasNotas();
        const faltasData = await listarTodasFaltas();
        setNotas(notasData);
        setFaltas(faltasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar notas ou faltas.");
      }
    }
    carregarDados();
  }, []);

  return (
    <>
      <Navbar />
      <div className="pagina-notas-faltas">
        <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar">
          <FaArrowLeft />
        </div>
        <h2>Notas e Presenças</h2>

        <div className="secao-notas">
          <h3>Notas</h3>
          {notas.length === 0 ? (
            <p>Nenhuma nota registrada.</p>
          ) : (
            <div className="tabela">
              <div className="linha-cabecalho">
                <span>Aluno</span>
                <span>Disciplina</span>
                <span>Nota</span>
              </div>
              {notas.map((nota) => (
                <div className="linha" key={nota.id}>
                  <span>{nota.nomeAluno}</span>
                  <span>{nota.nomeDisciplina}</span>
                  <span>{nota.valor}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="secao-faltas">
          <h3>Faltas</h3>
          {faltas.length === 0 ? (
            <p>Nenhuma falta registrada.</p>
          ) : (
            <div className="tabela">
              <div className="linha-cabecalho">
                <span>Aluno</span>
                <span>Disciplina</span>
                <span>Data</span>
                <span>Justificada</span>
              </div>
              {faltas.map((falta) => (
                <div className="linha" key={falta.id}>
                  <span>{falta.nomeAluno}</span>
                  <span>{falta.nomeDisciplina}</span>
                  <span>{falta.dataFalta}</span>
                  <span>{falta.justificada ? "Sim" : "Não"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
