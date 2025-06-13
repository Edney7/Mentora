import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/secretaria/DetalhesTurma.css";
import {
  buscarTurmaDetalhada,
  buscarDisciplinas,
  listarProfessoresDaDisciplina,
  vincularDisciplinaEProfessorNaTurma,
  listarDisciplinaTurma,
} from "../../services/ApiService";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Modal from "../../components/Modal";

export default function DetalhesTurma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turma, setTurma] = useState(null);
  const [todasDisciplinas, setTodasDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [ofertasDisciplinaTurma, setOfertasDisciplinaTurma] = useState([]);
  const [modalDisciplinaAberto, setModalDisciplinaAberto] = useState(false);
  const [professoresDaDisciplina, setProfessoresDaDisciplina] = useState([]);
  const [professorSelecionado, setProfessorSelecionado] = useState("");

  console.log("Professores retornados:", professoresDaDisciplina);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await buscarTurmaDetalhada(id);
        const todas = await buscarDisciplinas();
        // const vinculadas = await listarDisciplinasDaTurma(id); // <--- Esta pode ser removida ou adaptada
        const ofertas = await listarDisciplinaTurma(id); // <-- NOVA CHAMADA

        setTurma({
          ...dados,
          disciplinas: dados.disciplinas || [], // Manter se precisar de outras lógicas
        });
        // setDisciplinasDaTurma(vinculadas); // Adapte ou remova
        setTodasDisciplinas(todas);
        setOfertasDisciplinaTurma(ofertas); // <--- ATUALIZA O NOVO ESTADO
      } catch (error) {
        console.error("Erro ao buscar detalhes da turma:", error);
        alert("Erro ao buscar turma.");
      }
    };
    carregarDados();
  }, [id]);
  if (!turma) return <p>Carregando turma...</p>;

  return (
    <>
      <Navbar />
      <div className="detalhes-turma-container">
        <div className="topo">
          <div
            className="voltar-seta"
            onClick={() => navigate(-1)}
            title="Voltar"
          >
            <FaArrowLeft />
          </div>
          <span className="titulo-turma">TURMA: {turma.nome}</span>
        </div>
        <div className="painel-duplo">
          <div className="painel-esquerdo">
            <div className="cabecalho">
              <span className="titulo">Alunos </span>
            </div>
            <div className="grupo">
              {turma.alunos.map((a) => (
                <div className="item" key={a.id}>
                  {a.nomeUsuario}
                </div>
              ))}
            </div>
          </div>

          <div className="painel-direito">
            <div className="cabecalho">
              <span className="titulo">Disciplinas</span>{" "}
              <button
                onClick={() => setModalDisciplinaAberto(true)}
                className="btn-icon-only"
              >
                <FaPlus className="btn-icone" />
              </button>
            </div>
            <div className="tabela-disciplina">
              <div className="linha-cabecalho-disciplina">
                <span>Disciplina</span>
                <span>Professor</span>
              </div>
              {ofertasDisciplinaTurma.map(
                (
                  oferta 
                ) => (
                  <div className="linha-disciplina" key={oferta.id}>
                    <span>{oferta.nomeDisciplina} </span>
                    <span>{oferta.nomeProfessor}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <Modal
            isOpen={modalDisciplinaAberto}
            onClose={() => setModalDisciplinaAberto(false)}
            title="Adicionar Disciplina à Turma"
            className="modal-add-disciplina"
          >
            <select
              className="modal-select-disicplina"
              value={disciplinaSelecionada}
              onChange={async (e) => {
                const idSelecionado = e.target.value;
                setDisciplinaSelecionada(idSelecionado);
                setProfessorSelecionado("");
                try {
                  const professores = await listarProfessoresDaDisciplina(
                    idSelecionado
                  );
                  setProfessoresDaDisciplina(professores);
                } catch (error) {
                  console.error("Erro ao carregar professores:", error);
                  alert("Erro ao carregar professores da disciplina.");
                }
              }}
            >
              <option value="">Selecione uma disciplina</option>
              {todasDisciplinas.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
            {professoresDaDisciplina.length > 0 && (
              <select
               className="modal-select-disicplina"
                value={professorSelecionado}
                onChange={(e) => setProfessorSelecionado(e.target.value)}
              >
                <option value="">Selecione o professor</option>
                {professoresDaDisciplina.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nomeUsuario}
                  </option>
                ))}
              </select>
            )}

            <button className="btn-add-disciplina"
              
              onClick={async () => {
                const disciplina = todasDisciplinas.find(
                  (d) => d.id === parseInt(disciplinaSelecionada)
                );
                const professor = professoresDaDisciplina.find(
                  (p) => p.id === parseInt(professorSelecionado)
                );

                if (!disciplina || !professor) {
                  alert("Selecione uma disciplina e um professor.");
                  return;
                }

                try {
                  // CHAMA A NOVA API PARA VINCULAR DISCIPLINA E PROFESSOR NA TURMA
                  await vincularDisciplinaEProfessorNaTurma(
                    id,
                    disciplina.id,
                    professor.id
                  );

                  // Após o sucesso, atualiza o estado de 'ofertasDisciplinaTurma'
                  // para incluir a nova oferta.
                  setOfertasDisciplinaTurma((prevOfertas) => [
                    ...prevOfertas,
                    {
                      // Crie um objeto DTO semelhante ao que o backend retornaria
                      id: Date.now(), // Um ID temporário para o frontend, ou o ID retornado pela API
                      disciplinaId: disciplina.id,
                      nomeDisciplina: disciplina.nome,
                      professorId: professor.id,
                      nomeProfessor: professor.nomeUsuario,
                    },
                  ]);

                  // Resetar estados do modal
                  setDisciplinaSelecionada("");
                  setProfessorSelecionado("");
                  setProfessoresDaDisciplina([]); // Limpa os professores do segundo select
                  setModalDisciplinaAberto(false);
                } catch (error) {
                  console.error(
                    "Erro ao vincular disciplina e professor na turma:",
                    error
                  );
                  alert("Erro ao adicionar disciplina e professor à turma.");
                }
              }}
            >
              Adicionar
            </button>
          </Modal>
        </div>
      </div>
    </>
  );
}
