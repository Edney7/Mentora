import React, {useState, useEffect} from "react";
import "../../styles/Home.css";
import Navbar from "../../components/Navbar"; 
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/Calendar"; // Importando o componente Calendar
import { listarUsuario,buscarAlunos, buscarProfessores,  buscarTurmas } from "../../services/ApiService"; // Importando os serviços
import animacaoHomeSecretaria from "../../assets/animacaoHomeSecretaria.png"; // Importando a animação

export default function HomeSecretaria() {
  const Navigate = useNavigate();
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalProfessores, setTotalProfessores] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalTurmas, setTotalTurmas] = useState(0);

    useEffect(() => {
    async function carregarTotais() {
      const usuarios = await listarUsuario();
      const professores = await buscarProfessores();
      const alunos = await buscarAlunos();
      const turmas = await buscarTurmas();

      setTotalUsuarios(usuarios.length);
      setTotalProfessores(professores.length);
      setTotalAlunos(alunos.length);
      setTotalTurmas(turmas.length);
    }

    carregarTotais();
  }, []);
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

        <div onClick={() => Navigate("/listaUsuario")} className="top-card">
          <h2>Gerenciar Usuarios</h2>
         <img src={animacaoHomeSecretaria} alt="Estudante com livros" className="top-img" />
        </div>
       <div className="button-grid">
          <button  className="btn">Ausência do Professor</button>
          <button onClick={() => Navigate("/disciplina")} className="btn">Presença e falta</button>
        </div>
        <div className="button-grid">
          <button  className="btn">Gerenciar Turmas</button>
          <button onClick={() => Navigate("/disciplina")} className="btn">Gerenciar Disciplinas</button>
        </div>
      </main>

      <section className="event-panel">
       <div className="event-card branco">
        <div className="calendar-container">
      <Calendar />
        </div>
      </div>
        
       <div className="event-group">
        <div className="event-card verde">
          <span>Proximo Feriado</span>
          <span className="hora">xx/xx</span>
        </div>
        <button className="event-card laranja" onClick={() => console.log('Cliquei!')}>
          <h2>Cadastrar eventos</h2>
          
        </button>
        </div>
      </section>
    </div>
    </>
  );
}