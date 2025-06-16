import React, { useEffect, useState } from "react";
import { listarTodasNotas, listarTodasFaltas } from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../../styles/secretaria/NotasPresencasAlunos.css";

// REMOVIDA: A função de formatar a data foi retirada.
// const formatarData = (dataString) => { ... };

export default function NotasPresencasAluno() {
  const [todasAsNotas, setTodasAsNotas] = useState([]);
  const [todasAsFaltas, setTodasAsFaltas] = useState([]);
  const [filtroAluno, setFiltroAluno] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      setErro('');
      try {
        const [notasData, faltasData] = await Promise.all([
          listarTodasNotas(),
          listarTodasFaltas(),
        ]);
        setTodasAsNotas(notasData || []);
        setTodasAsFaltas(faltasData || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErro("Erro ao carregar notas ou faltas. Verifique a conexão.");
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const notasFiltradas = todasAsNotas.filter(nota => {
    const matchAluno = nota.nomeAluno?.toLowerCase().includes(filtroAluno.toLowerCase());
    const matchDisciplina = nota.nomeDisciplina?.toLowerCase().includes(filtroDisciplina.toLowerCase());
    return matchAluno && matchDisciplina;
  });

  const faltasFiltradas = todasAsFaltas.filter(falta => {
    const matchAluno = falta.nomeAluno?.toLowerCase().includes(filtroAluno.toLowerCase());
    const matchDisciplina = falta.nomeDisciplina?.toLowerCase().includes(filtroDisciplina.toLowerCase());
    return matchAluno && matchDisciplina;
  });

  if (loading) {
    return <div className="pagina-notas-faltas"><p>Carregando dados...</p></div>;
  }

  if (erro) {
    return <div className="pagina-notas-faltas"><p className="error-message">{erro}</p></div>;
  }

  return (
    <div className="pagina-notas-faltas">
      <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar">
        <FaArrowLeft />
      </div>
      <h2>Notas e Presenças dos Alunos</h2>

      <div className="filtros-container">
        <input 
          type="text"
          className="filtro-input"
          placeholder="Filtrar por nome do aluno..."
          value={filtroAluno}
          onChange={(e) => setFiltroAluno(e.target.value)}
        />
        <input 
          type="text"
          className="filtro-input"
          placeholder="Filtrar por disciplina..."
          value={filtroDisciplina}
          onChange={(e) => setFiltroDisciplina(e.target.value)}
        />
      </div>

      <div className="secoes-container">
        <div className="secao">
          <h3>Notas</h3>
          {notasFiltradas.length === 0 ? (
            <p>Nenhuma nota encontrada para os filtros aplicados.</p>
          ) : (
            <div className="tabela">
              <div className="linha-cabecalho">
                <span>Aluno</span>
                <span>Disciplina</span>
                <span>Nota</span>
              </div>
              {notasFiltradas.map((nota) => (
                <div className="linha" key={`nota-${nota.id}`}>
                  <span>{nota.nomeAluno}</span>
                  <span>{nota.nomeDisciplina}</span>
                  <span>{nota.media}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="secao">
          <h3>Faltas</h3>
          {faltasFiltradas.length === 0 ? (
            <p>Nenhuma falta encontrada para os filtros aplicados.</p>
          ) : (
            <div className="tabela">
              <div className="linha-cabecalho">
                <span>Aluno</span>
                <span>Disciplina</span>
                <span>Data</span>
                <span>Justificada</span>
              </div>
              {faltasFiltradas.map((falta) => (
                <div className="linha" key={`falta-${falta.id}`}>
                  <span>{falta.nomeAluno}</span>
                  <span>{falta.nomeDisciplina}</span>
                  {/* ALTERAÇÃO AQUI: Mostrando a data sem formatação */}
                  <span>{falta.dataFalta || "-"}</span>
                  <span>{falta.justificada ? "Sim" : "Não"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}