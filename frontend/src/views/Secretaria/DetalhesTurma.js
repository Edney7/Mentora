import React, { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/DetalhesTurma.css";
import { buscarTurmaDetalhada, buscarDisciplinas, listarDisciplinasDaTurma, vincularDisciplinaNaTurma, listarProfessoresDaDisciplina } from "../../services/ApiService";
import { FaArrowLeft, FaPlus, FaPen } from "react-icons/fa";
import Modal from "../../components/Modal";

export default function DetalhesTurma() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turma, setTurma] = useState(null);
  const [todasDisciplinas, setTodasDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [disciplinasDaTurma, setDisciplinasDaTurma] = useState([]);
  const [modalDisciplinaAberto, setModalDisciplinaAberto] = useState(false);
  const [professoresDaDisciplina, setProfessoresDaDisciplina] = useState([]);
  const [professorSelecionado, setProfessorSelecionado] = useState("");


  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await buscarTurmaDetalhada(id);
        const todas = await buscarDisciplinas();
        const vinculadas = await listarDisciplinasDaTurma(id); // <- aqui pega as disciplinas da turma

       setTurma({
        ...dados,
        disciplinas: dados.disciplinas || [],
        });
        setDisciplinasDaTurma(vinculadas);
        setTodasDisciplinas(todas);
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
          <button className="btn-voltar" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Voltar
          </button>
          <h2>Editar turma</h2>
        </div>
        <div className="painel-duplo">
          <div className="painel-esquerdo">
            <div className="cabecalho">
              <span>Alunos <b>&</b> <span className="azul">Professores</span></span>
              <FaPlus className="btn-icone" />
            </div>
            <div className="grupo">
              <h4>Professores</h4>
              {turma.professores.map((p) => (
                <div className="item" key={p.id}>
                  <div className="linha-cor professor"></div>
                  {p.nomeUsuario}
                
                </div>
              ))}
              <h4>Alunos</h4>
              {turma.alunos.map((a) => (
                <div className="item" key={a.id}>
                  <div className="linha-cor aluno"></div>
                  {a.nomeUsuario}
                
                </div>
              ))}
            </div>
          </div>

          <div className="painel-direito">
            <div className="cabecalho">
              <span>TURMA {turma.nome}</span>
              <FaPen className="btn-icone" />
            </div>
            <div className="grupo">
              <label>Turno</label>
              <input value={turma.turno} readOnly />
              <label>Série</label>
              <input value={turma.serieAno} readOnly />

              <h4>Disciplinas</h4>
              <button 
                onClick={() => setModalDisciplinaAberto(true)}>
                <FaPlus className="btn-icone" /> 
                </button>

              {disciplinasDaTurma.map((d) => (
                <div className="item" key={d.id}>
                    <div className="linha-cor disciplina"></div>
                    {d.nome}
                    
                </div>
                ))}
              
                </div>

             
            </div>

           <Modal
            isOpen={modalDisciplinaAberto}
            onClose={() => setModalDisciplinaAberto(false)}
            title="Adicionar Disciplina à Turma"
            >
            <select
                className="item"
                value={disciplinaSelecionada}
               onChange={async (e) => {
                const idSelecionado = e.target.value;
                setDisciplinaSelecionada(idSelecionado);
                setProfessorSelecionado("");
                try {
                    const professores = await listarProfessoresDaDisciplina(idSelecionado);
                    setProfessoresDaDisciplina(professores);
                } catch (error) {
                    console.error("Erro ao carregar professores:", error);
                    alert("Erro ao carregar professores da disciplina.");
                }
                }}>
                <option value="">Selecione uma disciplina</option>
                {todasDisciplinas.map((d) => (
                <option key={d.id} value={d.id}>
                    {d.nome}
                </option>
                ))}
            </select>
            {professoresDaDisciplina.length > 0 && (
            <select
                className="item"
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

            
            <button
            className="btn-salvar"
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
                await vincularDisciplinaNaTurma(id, disciplina.id);

                // Atualiza disciplinas se ainda não estiver
                if (!disciplinasDaTurma.find((d) => d.id === disciplina.id)) {
                    setDisciplinasDaTurma((prev) => [...prev, disciplina]);
                }

                // Atualiza professores se ainda não estiver
                if (!professoresDaDisciplina.find((p) => p.id === professor.id)) {
                    setProfessoresDaDisciplina((prev) => [...prev, professor]);
                }

                setDisciplinaSelecionada("");
                setProfessorSelecionado("");
                setProfessoresDaDisciplina([]);
                setModalDisciplinaAberto(false);
                } catch (error) {
                console.error("Erro ao vincular:", error);
                alert("Erro ao adicionar disciplina/professor.");
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
