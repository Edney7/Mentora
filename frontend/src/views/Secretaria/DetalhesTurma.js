import React, { useEffect, useState, useCallback } from "react";
import "../../styles/secretaria/DetalhesTurma.css";
import Modal from "../../components/Modal";
import {
  buscarTurmaDetalhada,
  buscarDisciplinas,
  listarProfessoresDaDisciplina,
  vincularDisciplinaEProfessorNaTurma,
  listarDisciplinaTurma,
} from "../../services/ApiService";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify'; // 1. Importa o toast

export default function DetalhesTurma() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [turma, setTurma] = useState(null);
  const [todasDisciplinas, setTodasDisciplinas] = useState([]);
  const [ofertasDisciplinaTurma, setOfertasDisciplinaTurma] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [modalDisciplinaAberto, setModalDisciplinaAberto] = useState(false);

  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [professoresDaDisciplina, setProfessoresDaDisciplina] = useState([]);
  const [loadingProfessores, setLoadingProfessores] = useState(false);
  const [saving, setSaving] = useState(false);

  const carregarDadosDaPagina = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const [dadosTurma, todasDisciplinasData, ofertasData] = await Promise.all([
        buscarTurmaDetalhada(id),
        buscarDisciplinas(),
        listarDisciplinaTurma(id)
      ]);

      setTurma(dadosTurma);
      setTodasDisciplinas(todasDisciplinasData || []);
      setOfertasDisciplinaTurma(ofertasData || []);

    } catch (error) {
      console.error("Erro ao buscar detalhes da turma:", error);
      const errorMsg = "Falha ao carregar os dados da turma. Tente novamente.";
      toast.error(errorMsg); // Notificação de erro
      setErro(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarDadosDaPagina();
  }, [carregarDadosDaPagina]);

  const handleDisciplinaChange = async (e) => {
    const idDisciplina = e.target.value;
    setDisciplinaSelecionada(idDisciplina);
    setProfessorSelecionado("");
    setProfessoresDaDisciplina([]);

    if (!idDisciplina) return;

    setLoadingProfessores(true);
    try {
      const professores = await listarProfessoresDaDisciplina(idDisciplina);
      setProfessoresDaDisciplina(professores || []);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
      toast.error("Erro ao carregar professores da disciplina."); // Notificação de erro
    } finally {
      setLoadingProfessores(false);
    }
  };

  const handleVincularDisciplina = async () => {
    if (!disciplinaSelecionada || !professorSelecionado) {
      toast.warn("Por favor, selecione uma disciplina e um professor."); // Notificação de aviso
      return;
    }
    setSaving(true);
    try {
      const response = await vincularDisciplinaEProfessorNaTurma(id, disciplinaSelecionada, professorSelecionado);
      
      setOfertasDisciplinaTurma(prevOfertas => [...prevOfertas, response]);
      
      setDisciplinaSelecionada("");
      setProfessorSelecionado("");
      setProfessoresDaDisciplina([]);
      setModalDisciplinaAberto(false);
      toast.success("Disciplina vinculada com sucesso!"); // Notificação de sucesso

    } catch (error) {
      console.error("Erro ao vincular disciplina:", error);
      const errorMsg = error.response?.data?.message || "Erro ao vincular disciplina à turma.";
      toast.error(errorMsg); // Notificação de erro
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="detalhes-turma-container"><p>Carregando turma...</p></div>;
  if (erro) return <div className="detalhes-turma-container"><p className="error-message">{erro}</p></div>;

  return (
    <div className="detalhes-turma-container">
      <div className="topo">
        <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar"><FaArrowLeft /></div>
        <span className="titulo-turma">TURMA: {turma.nome}</span>
      </div>
      <div className="painel-duplo">
        <div className="painel-esquerdo">
          <div className="cabecalho"><span className="titulo">Alunos</span></div>
          <div className="grupo">
            {turma.alunos && turma.alunos.length > 0 ? (
              turma.alunos.map((a) => <div className="item" key={a.id}>{a.nomeUsuario}</div>)
            ) : (
              <p>Nenhum aluno nesta turma.</p>
            )}
          </div>
        </div>
        <div className="painel-direito">
          <div className="cabecalho">
            <span className="titulo">Disciplinas e Professores</span>
            <button onClick={() => setModalDisciplinaAberto(true)} className="btn-icon-only" title="Adicionar Disciplina">
              <FaPlus className="btn-icone" />
            </button>
          </div>
          <div className="tabela-disciplina">
            <div className="linha-cabecalho-disciplina">
              <span>Disciplina</span>
              <span>Professor</span>
            </div>
            {ofertasDisciplinaTurma.length > 0 ? (
              ofertasDisciplinaTurma.map((oferta) => (
                <div className="linha-disciplina" key={oferta.id}>
                  <span>{oferta.nomeDisciplina}</span>
                  <span>{oferta.nomeProfessor || "Não definido"}</span>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', padding: '10px'}}>Nenhuma disciplina vinculada.</p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={modalDisciplinaAberto} onClose={() => setModalDisciplinaAberto(false)} title="Adicionar Disciplina à Turma">
        <div className="form-add-disciplina">
          <label>1. Selecione a Disciplina</label>
          <select className="modal-select-disciplina" value={disciplinaSelecionada} onChange={handleDisciplinaChange}>
            <option value="">Selecione...</option>
            {todasDisciplinas.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>

          {loadingProfessores ? (
            <p>Carregando professores...</p>
          ) : disciplinaSelecionada && (
            <>
              <label>2. Selecione o Professor</label>
              <select className="modal-select-disciplina" value={professorSelecionado} onChange={(e) => setProfessorSelecionado(e.target.value)}>
                <option value="">Selecione...</option>
                {professoresDaDisciplina.length > 0 ? (
                  professoresDaDisciplina.map((p) => <option key={p.id} value={p.id}>{p.nomeUsuario}</option>)
                ) : (
                  <option disabled>Nenhum professor para esta disciplina</option>
                )}
              </select>
            </>
          )}

          <button className="btn-add-disciplina" onClick={handleVincularDisciplina} disabled={saving || !professorSelecionado}>
            {saving ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}