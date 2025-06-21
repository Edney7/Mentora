import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  listarAlunosDaTurma,
  listarNotasDoAlunoPorDisciplina,
  listarDisciplinasDoProfessor,
  // lancarNota, // Não usaremos aqui, já que estamos usando axios diretamente
  // registrarFalta, // Mantido comentado como estava
} from "../../services/ApiService";
import axios from "axios"; // Importe o axios, é essencial para suas chamadas diretas
import "../../styles/professor/TurmaDetalhe.css";

export default function TurmaDetalhe() {
  const { id } = useParams(); // ID da turma
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  // **Ajustado para objeto vazio**, facilitando acesso aninhado
  const [notas, setNotas] = useState({});
  const [faltas, setFaltas] = useState([]); // Não usado ativamente no código fornecido
  const [professorId, setProfessorId] = useState(null); // Adicionado para armazenar o ID do professor

  // ---
  // Efeito para carregar alunos e disciplinas do professor
  // ---
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const respostaAlunos = await listarAlunosDaTurma(id);
        setAlunos(respostaAlunos);

        const idProfessorLogado = localStorage.getItem("idProfessor");
        if (idProfessorLogado) {
          setProfessorId(parseInt(idProfessorLogado, 10)); // Armazena o ID do professor como número
          const disciplinaResposta = await listarDisciplinasDoProfessor(idProfessorLogado);
          setDisciplinas(disciplinaResposta);
        } else {
          console.warn("ID do professor não encontrado no localStorage.");
          alert("Erro: ID do professor não disponível. Faça login novamente.");
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        alert("Erro ao buscar alunos ou disciplinas.");
      }
    }
    carregarDadosIniciais();
  }, [id]); // Depende apenas do ID da turma e do estado professorId

  // ---
  // Efeito para carregar notas do aluno selecionado
  // ---
  useEffect(() => {
    async function carregarNotasDoAlunoSelecionado() {
      // Só continua se o aluno estiver selecionado, houver disciplinas e professorId carregado
      if (!alunoSelecionado || disciplinas.length === 0 || professorId === null) return;

      // Vamos iterar sobre todas as disciplinas que o professor ministra
      // e buscar as notas para o aluno selecionado em cada uma delas.
      // Isso é mais robusto do que pegar apenas a primeira disciplina.
      const notasFormatadasDoAluno = {};

      try {
        for (const disc of disciplinas) {
          console.log("Buscando notas para aluno:", alunoSelecionado.id, "disciplina:", disc.id);
          // A função listarNotasDoAlunoPorDisciplina deve retornar um array de notas
          // para o aluno e disciplina específicos.
          const notasRecebidasPorDisciplina = await listarNotasDoAlunoPorDisciplina(
            alunoSelecionado.id,
            disc.id
          );

          notasRecebidasPorDisciplina.forEach((nota) => {
            // Supondo que a 'nota' retornada tenha `id`, `bimestre`, `prova1`, `prova2`
            // e os IDs do aluno e disciplina estejam diretamente nela (não aninhados)
            const { id: notaId, alunoId: returnedAlunoId, disciplinaId: returnedDisciplinaId, bimestre, prova1, prova2 } = nota;

            // Usa os IDs que vêm da nota, ou os IDs atuais se não vierem
            const currentAlunoId = returnedAlunoId || alunoSelecionado.id;
            const currentDisciplinaId = returnedDisciplinaId || disc.id;

            if (!notasFormatadasDoAluno[currentAlunoId]) notasFormatadasDoAluno[currentAlunoId] = {};
            if (!notasFormatadasDoAluno[currentAlunoId][currentDisciplinaId]) notasFormatadasDoAluno[currentAlunoId][currentDisciplinaId] = {};

            notasFormatadasDoAluno[currentAlunoId][currentDisciplinaId][bimestre] = {
              prova1,
              prova2,
              id: notaId,
              cadastrada: true, // Indica que a nota já existe no DB
            };
          });
        }

        // Atualiza o estado 'notas' de forma imutável, mesclando com o que já existe
        setNotas((prev) => {
          const atualizadas = { ...prev };
          Object.entries(notasFormatadasDoAluno).forEach(([alunoIdKey, disciplinasObj]) => {
            if (!atualizadas[alunoIdKey]) atualizadas[alunoIdKey] = {};
            Object.entries(disciplinasObj).forEach(([disciplinaIdKey, bimestresObj]) => {
              if (!atualizadas[alunoIdKey][disciplinaIdKey]) atualizadas[alunoIdKey][disciplinaIdKey] = {};
              Object.entries(bimestresObj).forEach(([bimestreKey, nota]) => {
                atualizadas[alunoIdKey][disciplinaIdKey][bimestreKey] = nota;
              });
            });
          });
          return atualizadas;
        });

      } catch (error) {
        console.error("Erro ao buscar notas do aluno:", error.response?.data || error.message || error);
        alert("Erro ao carregar notas lançadas.");
      }
    }
    carregarNotasDoAlunoSelecionado();
  }, [alunoSelecionado, disciplinas, professorId]); // Depende do aluno, disciplinas e professorId

  // ---
  // Lida com a mudança nos inputs de nota
  // ---
  const handleNotaChange = (alunoId, disciplinaId, bimestre, campo, valor) => {
    setNotas((prev) => ({
      ...prev,
      [alunoId]: {
        ...(prev[alunoId] || {}), // Garante que o objeto para alunoId exista
        [disciplinaId]: {
          ...((prev[alunoId] && prev[alunoId][disciplinaId]) || {}), // Garante que o objeto para disciplinaId exista
          [bimestre]: {
            ...((prev[alunoId]?.[disciplinaId]?.[bimestre]) || {}), // Garante que o objeto para bimestre exista
            [campo]: valor,
          },
        },
      },
    }));
  };

  // ---
  // Salva ou edita as notas
  // ---
  const salvarNotas = async (alunoId, disciplinaId, bimestre) => {
    // Pega a nota atual do estado
    const notaAtualDoEstado = notas[alunoId]?.[disciplinaId]?.[bimestre];

    // Validação básica
    if (!notaAtualDoEstado || notaAtualDoEstado.prova1 === undefined || notaAtualDoEstado.prova2 === undefined) {
      return alert("Preencha as duas notas antes de salvar.");
    }

    const prova1 = parseFloat(notaAtualDoEstado.prova1);
    const prova2 = parseFloat(notaAtualDoEstado.prova2);
    const media = (prova1 + prova2) / 2;

    if (isNaN(prova1) || isNaN(prova2)) {
      return alert("As notas devem ser números válidos.");
    }

    if (professorId === null) {
      alert("ID do professor não está disponível. Por favor, recarregue a página.");
      return;
    }

    // Objeto DTO para enviar ao backend
    const notaDTO = {
      alunoId,
      disciplinaId,
      professorId, // Usa o professorId do estado
      bimestre,
      prova1,
      prova2,
      media,
    };

    try {
      let response;
      if (notaAtualDoEstado.id) {
        // Se a nota já tem um ID, é uma atualização (PUT)
        console.log("Atualizando nota existente:", notaAtualDoEstado.id, notaDTO);
        response = await axios.put(`http://localhost:8080/notas/${notaAtualDoEstado.id}`, notaDTO);
        alert("Nota atualizada com sucesso!");
      } else {
        // Se não tem ID, é uma nova nota (POST)
        console.log("Cadastrando nova nota:", notaDTO);
        response = await axios.post("http://localhost:8080/notas", notaDTO);
        alert("Nota cadastrada com sucesso!");
      }

      const notaSalvaDoBackend = response.data; // Dados da nota como retornados pelo backend

      // **CORREÇÃO CRÍTICA AQUI:**
      // Atualizamos o estado `notas` usando os IDs que já conhecemos (alunoId, disciplinaId, bimestre)
      // e preenchemos os dados da nota com o que veio do backend, incluindo o ID retornado.
      setNotas((prev) => ({
        ...prev,
        [alunoId]: {
          ...(prev[alunoId] || {}),
          [disciplinaId]: {
            ...(prev[alunoId]?.[disciplinaId] || {}),
            [bimestre]: {
              ...notaSalvaDoBackend, // Copia todos os campos da resposta do backend (incluindo id)
              id: notaSalvaDoBackend.id, // Garante que o ID correto esteja no campo 'id'
              cadastrada: true, // Marca como cadastrada
            },
          },
        },
      }));

    } catch (error) {
      console.error("Erro ao salvar nota:", error.response?.data || error.message || error);
      alert("Erro ao salvar nota. Verifique o console para mais detalhes.");
    }
  };

  // ---
  // Componente de renderização (JSX)
  // ---
  return (
    <>
      <h1 className="titulo-turma">Notas e faltas - TURMA {id}</h1>
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
                {/* Esses checkboxes parecem ser para faltas, mas não estão conectados a um estado */}
                <input type="checkbox" readOnly />
                <input type="checkbox" readOnly />
              </div>
            </div>
          ))}
        </div>

        <div className="painel-notas">
          {alunoSelecionado && (
            <>
              <h3 className="titulo">NOTAS - {alunoSelecionado.nomeUsuario}</h3>
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
                              value={notas?.[alunoSelecionado.id]?.[disciplina.id]?.[bimestre]?.prova1 ?? ""}
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
                              value={notas?.[alunoSelecionado.id]?.[disciplina.id]?.[bimestre]?.prova2 ?? ""}
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
                              {/* Verifica se a nota tem um ID para exibir "Editar" ou "Salvar" */}
                              {notas?.[alunoSelecionado.id]?.[disciplina.id]?.[bimestre]?.id
                                ? "Editar"
                                : "Salvar"}
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