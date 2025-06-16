import React, { useEffect, useState, useCallback } from "react";
import "../../styles/secretaria/Home.css"; 
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/Calendario";
import { 
    listarTodosOsUsuarios, 
    listarProfessoresAtivos, 
    listarAlunosAtivos,       
    buscarTurmasAtivas, 
    listarEventos, 
    cadastrarEvento       
} from "../../services/ApiService"; 
import animacaoHomeSecretaria from "../../assets/animacaoHomeSecretaria.png";
import Modal from "../../components/Modal";
import { toast } from 'react-toastify'; // 1. Importa o toast

export default function HomeSecretaria() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalProfessores, setTotalProfessores] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalTurmas, setTotalTurmas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const [eventos, setEventos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoEvento, setNovoEvento] = useState({ titulo: '', descricao: '', data: '', tipo: ''});
  const [saving, setSaving] = useState(false); // Estado para o botão Salvar

  const abrirModal = () => {
    setNovoEvento({ titulo: '', descricao: '', data: '', tipo: '' }); // Limpa o formulário
    setModalAberto(true);
  };
  const fecharModal = () => setModalAberto(false);

  const carregarDadosDaPagina = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const [
        usuariosData,
        professoresData,
        alunosData,
        turmasData,
        eventosData,
      ] = await Promise.all([
        listarTodosOsUsuarios(),
        listarProfessoresAtivos(),
        listarAlunosAtivos(),
        buscarTurmasAtivas(),
        listarEventos(),
      ]);

      setTotalUsuarios(usuariosData?.length || 0);
      setTotalProfessores(professoresData?.length || 0);
      setTotalAlunos(alunosData?.length || 0);
      setTotalTurmas(turmasData?.length || 0);

      const formatados = eventosData.map(ev => ({ title: ev.titulo, date: ev.data, ...ev }));
      setEventos(formatados);

    } catch (error) {
      console.error("Erro ao carregar dados da página:", error);
      const errorMsg = "Falha ao carregar dados do painel. Tente novamente.";
      toast.error(errorMsg); // Notificação de erro
      setErro(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosDaPagina();
  }, [carregarDadosDaPagina]);

  const adicionarEvento = async () => {
    if (!novoEvento.titulo || !novoEvento.descricao || !novoEvento.data || !novoEvento.tipo) {
      toast.warn('Preencha todos os campos do evento.'); // 2. Substituindo alert
      return;
    }
    const idSecretaria = localStorage.getItem('userId');
    if (!idSecretaria) {
        toast.error('Erro: Usuário não identificado. Faça o login novamente.'); // 2. Substituindo alert
        return;
    }

    setSaving(true);
    try {
      const eventoCadastrado = await cadastrarEvento({
        titulo: novoEvento.titulo,
        descricao: novoEvento.descricao,
        data: novoEvento.data,
        tipo: novoEvento.tipo,
        idSecretaria: parseInt(idSecretaria, 10),
        idCalendario: 1
      });
      
      // 3. Atualização otimizada da UI
      const eventoFormatado = { title: eventoCadastrado.titulo, date: eventoCadastrado.data, ...eventoCadastrado };
      setEventos(prevEventos => [eventoFormatado, ...prevEventos]);
      
      toast.success("Evento cadastrado com sucesso!");
      fecharModal();

    } catch (err) {
      console.error("Erro ao cadastrar evento:", err);
      const errorMsg = err.response?.data?.message || "Erro ao cadastrar evento.";
      toast.error(errorMsg); // 2. Substituindo alert
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
        <div className="home-secretaria-container" style={{textAlign: 'center', paddingTop: '50px'}}>
            <p>Carregando dados do painel...</p>
        </div>
    );
  }

  return (
    <div className="home-secretaria-container">
      <main className="main-content">
        <div className="card-info">
          <div className="card-info-item"><h3>Total de Usuários</h3><p>{totalUsuarios}</p></div>
          <div className="card-info-item"><h3>Professores Ativos</h3><p>{totalProfessores}</p></div>
          <div className="card-info-item"><h3>Alunos Matriculados</h3><p>{totalAlunos}</p></div>
          <div className="card-info-item"><h3>Total de Turmas</h3><p>{totalTurmas}</p></div>
        </div>
        <div onClick={() => navigate("/secretaria/usuarios")} className="top-card">
          <h2>Gerenciar Usuarios</h2>
          <img src={animacaoHomeSecretaria} alt="Estudante com livros" className="top-img" />
        </div>
        <div className="button-grid">
          <button onClick={() => navigate("/secretaria/ausenciaProfessor")} className="btn">Ausência do Professor</button>
          <button onClick={() => navigate("/secretaria/notasPresencasAlunos")} className="btn">Presença e falta</button>
        </div>
        <div className="button-grid">
          <button onClick={() => navigate("/secretaria/turmas")} className="btn">Gerenciar Turmas</button>
          <button onClick={() => navigate("/secretaria/disciplina")} className="btn">Gerenciar Disciplinas</button>
        </div>
      </main>
      
      {erro && <p className="error-message">{erro}</p>}

      <section className="event-panel"> 
        <div className="event-card branco"> 
          <div className="calendar-container"> 
            <Calendar  eventos={eventos} />
          </div>
        </div>
        <div className="event-group">
          <div className="event-card verde"><span>Próximo Feriado</span><span className="hora">xx/xx</span></div>
          <button className="event-card laranja" onClick={abrirModal}><h2>Cadastrar Eventos</h2></button>
          <Modal isOpen={modalAberto} onClose={fecharModal} contentLabel="Cadastrar Evento">
            <h3>Cadastrar Evento</h3>
            <div className="form-grupo">
              <label htmlFor="titulo">Título</label>
              <input id="titulo" type="text" placeholder="Ex: Reunião de Pais" value={novoEvento.titulo} onChange={(e) => setNovoEvento(prev => ({ ...prev, titulo: e.target.value }))} />
            </div>
            <div className="form-grupo">
              <label htmlFor="descricao">Descrição</label>
              <input id="descricao" type="text" placeholder="Ex: Reunião do 1º bimestre" value={novoEvento.descricao} onChange={(e) => setNovoEvento(prev => ({ ...prev, descricao: e.target.value }))} />
            </div>
            <div className="form-grupo">
              <label htmlFor="data">Data</label>
              <input id="data" type="date" value={novoEvento.data} onChange={(e) => setNovoEvento(prev => ({ ...prev, data: e.target.value }))} />
            </div>
            <div className="form-grupo">
              <label htmlFor="tipo">Tipo de Evento</label>
              <input id="tipo" type="text" placeholder="Ex: FERIADO, EVENTO" value={novoEvento.tipo} onChange={(e) => setNovoEvento(prev => ({ ...prev, tipo: e.target.value }))} />
            </div>
            <div className="modal-actions">
              <button onClick={fecharModal} className="btn-cancelar">Cancelar</button>
              <button onClick={adicionarEvento} disabled={saving} className="btn-salvar">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </Modal>
        </div>
      </section>
    </div>
  );
}