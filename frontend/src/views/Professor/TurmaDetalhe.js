import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  listarAlunosDaTurma,
  listarNotasDoAlunoPorDisciplina,
  listarDisciplinasDoProfessor,
  lancarNota,
  registrarFalta,
} from "../../services/ApiService";
import "../../styles/professor/TurmaDetalhe.css";

export default function TurmaDetalhe() {
  const { id } = useParams(); // ID da turma
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [notas, setNotas] = useState([]);
  const [faltas, setFaltas] = useState([]);

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const resposta = await listarAlunosDaTurma(id);
        setAlunos(resposta);
        const idProfessor = localStorage.getItem("idProfessor");
        const disciplinaResposta = await listarDisciplinasDoProfessor(idProfessor);
        setDisciplinas(disciplinaResposta);

      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        alert("Erro ao buscar alunos da turma.");
      }
    }
    carregarAlunos();
  }, [id]);

  /*useEffect(() => {
    async function carregarNotasEFaltas() {
      if (!alunoSelecionado) return;
      const notas = await listarNotasDoAlunoPorDisciplina(alunoSelecionado.id, disciplinaId);
      const faltas = await listarFaltasDoAlunoPorDisciplina(alunoSelecionado.id, disciplinaId);
      setNotas(notas);
      setFaltas(faltas);
    }
    carregarNotasEFaltas();
  }, [alunoSelecionado, disciplinaId]);*/

  const handleNotaChange = (alunoId, disciplinaId, bimestre, campo, valor) => {
    setNotas((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        [disciplinaId]: {
          ...((prev[alunoId] && prev[alunoId][disciplinaId]) || {}),
          [bimestre]: {
            ...((prev[alunoId]?.[disciplinaId]?.[bimestre]) || {}),
            [campo]: valor,
          },
        },
      },
    }));
  };

  const salvarNotas = async (alunoId, disciplinaId, bimestre) => {
    const nota = notas[alunoId]?.[disciplinaId]?.[bimestre];
    if (!nota || nota.prova1 === undefined || nota.prova2 === undefined) {
      return alert("Preencha as duas notas antes de salvar.");
    }

    try {
      const professorId = localStorage.getItem("idProfessor");
      await lancarNota({
        alunoId,
        disciplinaId,
        professorId: parseInt(professorId),
        bimestre,
        prova1: parseFloat(nota.prova1),
        prova2: parseFloat(nota.prova2),
        media:  (parseFloat(nota.prova1) + parseFloat(nota.prova2)) / 2,
     
      });
      alert("Notas salvas com sucesso!");
      console.log("Enviando nota:", lancarNota);
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      alert("Erro ao salvar nota.");
    }
  };


  const handleFalta = async (bimestre) => {
    const confirmar = window.confirm(`Registrar falta no ${bimestre}º Bimestre?`);
    if (!confirmar) return;
    await registrarFalta({
      alunoId: alunoSelecionado.id,
      bimestre,
      justificada: false,
    });
    setAlunoSelecionado({ ...alunoSelecionado });
  };

  return (
    <>
     
      <h1 className="titulo-turma">TURMA {id}</h1>
      <div className="painel-geral">
        <div className="painel-alunos">
          <h3 className="titulo">ALUNOS</h3>
          {alunos.map((aluno) => (
            <div
              key={aluno.id}
              className={`aluno-box ${alunoSelecionado?.id === aluno.id ? "selecionado" : ""}`}
              onClick={() => setAlunoSelecionado(aluno)}
            >
              {aluno.nomeUsuario}
              <div>
                <input type="checkbox" readOnly />
                <input type="checkbox" readOnly />
              </div>
            </div>
          ))}
        </div>

        <div className="painel-notas">
          {alunoSelecionado && (
            <>
              <h3 className="titulo">
                NOTAS - {alunoSelecionado.nomeUsuario}
              </h3>
              <div className="tabela-notas">
                <table>
                  <thead>
                    <tr>
                    
                      <th>Disciplina</th>
                      <th>Bimestre</th>
                      <th>Prova 1</th>
                      <th>Prova 2</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                     {disciplinas.map((disciplina) =>
                        [1, 2, 3, 4].map((bimestre) => (
                          <tr key={`${alunoSelecionado.id}-${disciplina.id}-${bimestre}`}>
                            
                            <td>{disciplina.nome}</td> 
                            <td>{bimestre}º</td> 
                            <td>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={notas[alunoSelecionado.id]?.[disciplina.id]?.[bimestre]?.prova1 || ""}
                                onChange={(e) =>
                                  handleNotaChange(
                                    alunoSelecionado.id,
                                    disciplina.id,
                                    bimestre,
                                    "prova1",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={notas[alunoSelecionado.id]?.[disciplina.id]?.[bimestre]?.prova2 || ""}
                                onChange={(e) =>
                                  handleNotaChange(
                                    alunoSelecionado.id,
                                    disciplina.id,
                                    bimestre,
                                    "prova2",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <button
                                onClick={() =>
                                  salvarNotas(alunoSelecionado.id, disciplina.id, bimestre)
                                }
                              >
                                Salvar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}