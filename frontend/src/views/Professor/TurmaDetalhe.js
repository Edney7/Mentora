import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  listarAlunosDaTurma,
  listarNotasDoAlunoPorDisciplina,
  listarDisciplinasDoProfessor,
  criarOuObterAula, 
  listarAulasPorProfessorEDisciplinaETurma, 
  sincronizarFaltasPorAula, 
  listarFaltasDeUmaAula, 
} from "../../services/ApiService";
import axios from "axios"; 
import "../../styles/professor/TurmaDetalhe.css";

export default function TurmaDetalhe() {
  const { id: turmaId } = useParams(); 
  const [alunos, setAlunos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [notas, setNotas] = useState({});
  const [professorId, setProfessorId] = useState(null); 
  // --- NOVOS ESTADOS PARA AULAS E FALTAS ---
  const [dataAula, setDataAula] = useState(""); 
  const [topicoAula, setTopicoAula] = useState(""); 
  const [disciplinaAulaSelecionada, setDisciplinaAulaSelecionada] = useState(""); 
  const [aulasExistentes, setAulasExistentes] = useState([]); 
  const [aulaAtualSelecionada, setAulaAtualSelecionada] = useState(null); 
  const [disciplinaDaAula, setDisciplinaDaAula] = useState(null);

 
  const [presencaAlunos, setPresencaAlunos] = useState({});
 
  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const respostaAlunos = await listarAlunosDaTurma(turmaId);
        setAlunos(respostaAlunos);

        const idProfessorLogado = localStorage.getItem("idProfessor");
        if (idProfessorLogado) {
          setProfessorId(parseInt(idProfessorLogado, 10)); 
          const disciplinaResposta = await listarDisciplinasDoProfessor(idProfessorLogado);
          setDisciplinas(disciplinaResposta);
          if (disciplinaResposta.length > 0) {
  setDisciplinaDaAula(disciplinaResposta[0]); // salva o objeto completo
  setDisciplinaAulaSelecionada(disciplinaResposta[0].id); // salva apenas o ID
}
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
  }, [turmaId]); 

  useEffect(() => {
    async function carregarNotasDoAlunoSelecionado() {
      if (!alunoSelecionado || disciplinas.length === 0 || professorId === null) return;


      const notasFormatadasDoAluno = {};

      try {
        for (const disc of disciplinas) {
          console.log("Buscando notas para aluno:", alunoSelecionado.id, "disciplina:", disc.id);
        
          const notasRecebidasPorDisciplina = await listarNotasDoAlunoPorDisciplina(
            alunoSelecionado.id,
            disc.id
          );

          notasRecebidasPorDisciplina.forEach((nota) => {
            const { id: notaId, alunoId: returnedAlunoId, disciplinaId: returnedDisciplinaId, bimestre, prova1, prova2 } = nota;
            const currentAlunoId = returnedAlunoId || alunoSelecionado.id;
            const currentDisciplinaId = returnedDisciplinaId || disc.id;

            if (!notasFormatadasDoAluno[currentAlunoId]) notasFormatadasDoAluno[currentAlunoId] = {};
            if (!notasFormatadasDoAluno[currentAlunoId][currentDisciplinaId]) notasFormatadasDoAluno[currentAlunoId][currentDisciplinaId] = {};

            notasFormatadasDoAluno[currentAlunoId][currentDisciplinaId][bimestre] = {
              prova1,
              prova2,
              id: notaId,
              cadastrada: true, 
            };
          });
        }

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
  }, [alunoSelecionado, disciplinas, professorId]); 
  useEffect(() => {
    async function carregarAulasEFaltas() {
      if (!professorId || !disciplinaAulaSelecionada || !dataAula || dataAula.length < 10) {
        setAulasExistentes([]);
        setAulaAtualSelecionada(null);
        setPresencaAlunos({}); // Limpa as presenças quando os filtros mudam
        return;
      }

      try {
        const aulas = await listarAulasPorProfessorEDisciplinaETurma(
          professorId,
          disciplinaAulaSelecionada,
          turmaId
        );
        setAulasExistentes(aulas);

       
        const aulaEncontradaNaData = aulas.find(
          (aula) => aula.dataAula === dataAula
        );

        if (aulaEncontradaNaData) {
          setAulaAtualSelecionada(aulaEncontradaNaData);
          setTopicoAula(aulaEncontradaNaData.topico || "");
        
          const faltasDaAula = await listarFaltasDeUmaAula(aulaEncontradaNaData.id);
          const presencaInicial = {};
          alunos.forEach(aluno => {
        
            presencaInicial[aluno.id] = !faltasDaAula.some(falta => falta.alunoId === aluno.id);
          });
          setPresencaAlunos(presencaInicial);
        } else {
        
          setAulaAtualSelecionada(null);
          setTopicoAula(""); 
          const presencaInicial = {};
          alunos.forEach(aluno => {
            presencaInicial[aluno.id] = true; 
          });
          setPresencaAlunos(presencaInicial);
        }
      } catch (error) {
        console.error("Erro ao carregar aulas e faltas:", error.response?.data || error.message || error);
        alert("Erro ao carregar aulas para esta disciplina/data/turma.");
        setAulasExistentes([]);
        setAulaAtualSelecionada(null);
        setPresencaAlunos({});
      }
    }
    carregarAulasEFaltas();
  }, [professorId, disciplinaAulaSelecionada, dataAula, turmaId, alunos]); 

  const handleNotaChange = (alunoId, disciplinaId, bimestre, campo, valor) => {
    setNotas((prev) => ({
      ...prev,
      [alunoId]: {
        ...(prev[alunoId] || {}), 
          ...((prev[alunoId] && prev[alunoId][disciplinaId]) || {}), 
          [bimestre]: {
            ...((prev[alunoId]?.[disciplinaId]?.[bimestre]) || {}), 
            [campo]: valor,
          },
        },
      }
  ))};
  

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

    const notaDTO = {
      alunoId,
      disciplinaId,
      professorId, 
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

      const notaSalvaDoBackend = response.data; 

    
      setNotas((prev) => ({
        ...prev,
        [alunoId]: {
          ...(prev[alunoId] || {}),
          [disciplinaId]: {
            ...(prev[alunoId]?.[disciplinaId] || {}),
            [bimestre]: {
              ...notaSalvaDoBackend, 
              id: notaSalvaDoBackend.id, 
              cadastrada: true, 
            },
          },
        },
      }));

    } catch (error) {
      console.error("Erro ao salvar nota:", error.response?.data || error.message || error);
      alert("Erro ao salvar nota. Verifique o console para mais detalhes.");
    }
  };
  const handleSalvarAulaEFaltas = async () => {
    if (!professorId || !disciplinaAulaSelecionada || !dataAula || !topicoAula) {
      alert("Por favor, preencha a disciplina, data e tópico da aula.");
      return;
    }

    const aulaDTO = {
      disciplinaId: disciplinaAulaSelecionada,
      professorId: professorId,
      turmaId: parseInt(turmaId, 10), // Garante que é um número
      dataAula: dataAula, // Formato yyyy-MM-dd
      topico: topicoAula,
    };

    try {
      // 1. Cria ou obtém a aula
      const aulaResponse = await criarOuObterAula(aulaDTO);
      setAulaAtualSelecionada(aulaResponse); // Armazena a aula criada/obtida
      alert(`Aula "${aulaResponse.topico}" (${aulaResponse.dataAula}) ${aulaAtualSelecionada ? "atualizada" : "criada"} com sucesso!`);

      // 2. Prepara a lista de faltas a serem sincronizadas
      const faltasParaBackend = [];
      alunos.forEach(aluno => {
        if (!presencaAlunos[aluno.id]) { // Se o aluno NÃO está presente, ele tem falta
          faltasParaBackend.push({
            alunoId: aluno.id,
            // Adicione campos de justificativa se necessário na UI
            justificada: false, // Default para false, UI pode mudar
            descricaoJustificativa: null
          });
        }
      });

      // 3. Sincroniza as faltas para esta aula
      // O endpoint do backend espera: /faltas/sincronizar/{aulaId}/{professorId}
      const faltasSincronizadas = await sincronizarFaltasPorAula(
        aulaResponse.id,
        faltasParaBackend,
        professorId
      );
      console.log("Faltas sincronizadas:", faltasSincronizadas);
      alert(`Faltas da aula sincronizadas. Total de faltas registradas: ${faltasSincronizadas.length}`);

      // Opcional: Atualizar UI com faltas justificadas ou outros detalhes retornados.
      // Neste exemplo, setPresencaAlunos já reflete o estado atual.

    } catch (error) {
      console.error("Erro ao salvar aula e/ou sincronizar faltas:", error.response?.data || error.message || error);
      alert("Erro ao salvar aula e/ou sincronizar faltas. Verifique o console.");
    }
  };

  // ---
  // Lida com a mudança no checkbox de presença/falta
  // ---
  const handlePresencaChange = (alunoId, isPresente) => {
    setPresencaAlunos((prev) => ({
      ...prev,
      [alunoId]: isPresente,
    }));
  };
  // ---
  // Componente de renderização (JSX)
  // ---
  return (
    <>
      <h1 className="titulo-turma">Notas e faltas - TURMA {turmaId}</h1>
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
              <div></div>
            </div>
          ))}
        </div>

        <div className="painel-notas">
          {alunoSelecionado ? (
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
          ) : (
            <p>Selecione um aluno para visualizar e editar suas notas.</p>
          )}
        </div>

        <div className="painel-faltas">
          <h3 className="titulo">REGISTRO DE AULAS E FALTAS</h3>
          <div className="form-aula">
            <label>
              Disciplina:
              <span className="disciplina-display">
                {disciplinaDaAula ? disciplinaDaAula.nome : "Carregando Disciplina..."}
              </span>
              {disciplinaDaAula === null && professorId !== null && (
                <p style={{ color: 'red', fontSize: '0.8em' }}>Nenhuma disciplina encontrada para este professor. O registro de aula não será possível.</p>
              )}
            </label>
            <label>
              Data da Aula:
              <input
                type="date"
                value={dataAula}
                onChange={(e) => setDataAula(e.target.value)}
              />
            </label>
            <label>
              Tópico da Aula:
              <input
                type="text"
                value={topicoAula}
                onChange={(e) => setTopicoAula(e.target.value)}
                placeholder="Ex: Introdução à Álgebra"
              />
            </label>
            {aulaAtualSelecionada && (
              <p>Aula existente: ID {aulaAtualSelecionada.id} - Tópico: {aulaAtualSelecionada.topico}</p>
            )}
            {!aulaAtualSelecionada && disciplinaAulaSelecionada && dataAula && topicoAula && (
              <p>Esta será uma **nova aula** para {disciplinaDaAula?.nome || 'sua disciplina'} em {dataAula}.</p>
            )}

            {professorId && disciplinaAulaSelecionada && dataAula && topicoAula && (
              <button onClick={handleSalvarAulaEFaltas} className="btn-salvar-aula">
                {aulaAtualSelecionada ? "Atualizar Tópico e Sincronizar Faltas" : "Criar Aula e Sincronizar Faltas"}
              </button>
            )}
          </div>

          {(professorId && disciplinaAulaSelecionada && dataAula) && (
            <div className="tabela-faltas">
              <table>
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Presença</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((aluno) => (
                    <tr key={`falta-${aluno.id}`}>
                      <td>{aluno.nomeUsuario}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={presencaAlunos[aluno.id] ?? true}
                            onChange={(e) => handlePresencaChange(aluno.id, e.target.checked)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};