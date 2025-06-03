import React, { useEffect, useState, useCallback } from "react";
import "../../styles/Home.css"; 
import Navbar from "../../components/Navbar"; 
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/Calendar";
import { 
    listarTodosOsUsuarios, 
    listarProfessoresAtivos, 
    listarAlunosAtivos,      
    buscarTurmasAtivas       
} from "../../services/ApiService"; 
import animacaoHomeSecretaria from "../../assets/animacaoHomeSecretaria.png";


export default function HomeSecretaria() {
 
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalProfessores, setTotalProfessores] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalTurmas, setTotalTurmas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const carregarTotais = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const [
        usuariosData,
        professoresData,
        alunosData,
        turmasData,
      ] = await Promise.all([
        listarTodosOsUsuarios(),
        listarProfessoresAtivos(),
        listarAlunosAtivos(),
        buscarTurmasAtivas(),
      ]);

      setTotalUsuarios(usuariosData?.length || 0);
      setTotalProfessores(professoresData?.length || 0);
      setTotalAlunos(alunosData?.length || 0);
      setTotalTurmas(turmasData?.length || 0);
    } catch (error) {
      console.error("Erro ao carregar totais:", error);
      setErro("Falha ao carregar dados do painel.");
      setTotalUsuarios(0);
      setTotalProfessores(0);
      setTotalAlunos(0);
      setTotalTurmas(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTotais();
  }, [carregarTotais]);
  
  if (loading) {
    return (
        <>
            <Navbar />
            <div className="home-secretaria-container" style={{textAlign: 'center', paddingTop: '50px'}}>
                <p>Carregando dados do painel...</p>
            </div>
        </>
    );
  }

  return (
    <>
    <Navbar onLogout={() => console.log("Logout clicado")} />
    <div className="home-secretaria-container">
      
   
      <main className="main-content">
       <div className="card-info">
        <div className="card-info-item">
          <h3>Total de Usuários</h3>
          <p>{totalUsuarios}</p>
        </div>
        <div className="card-info-item">
          <h3>Professores Ativos</h3>
          <p>{totalProfessores}</p>
        </div>
        <div className="card-info-item">
          <h3>Alunos Matriculados</h3>
          <p>{totalAlunos}</p>
        </div>
        <div className="card-info-item">
          <h3>Total de Turmas</h3>
          <p>{totalTurmas}</p>
        </div>
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

      
        
        {erro && <p className="error-message" style={{textAlign: 'center', width: '100%', padding: '10px 0'}}>{erro}</p>}


        

        <section className="event-panel"> 
          <div className="event-card branco"> 
            <div className="calendar-container"> 
              <Calendar />
            </div>
          </div>
          
          <div className="event-group">
            <div className="event-card verde">
              <span>Próximo Feriado</span>
              <span className="hora">xx/xx</span>
            </div>
            <button className="event-card laranja" onClick={() => navigate("/secretaria/calendario/eventos/cadastrar")}>
              <h2>Cadastrar Eventos</h2>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
