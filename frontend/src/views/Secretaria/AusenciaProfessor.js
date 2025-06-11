import React, { useEffect, useState } from "react";
import { buscarAusencias, buscarAusenciasComFiltro } from "../../services/ApiService"; // você cria esse endpoint
import "../../styles/secretaria/AusenciaProfessor.css";
import Navbar from "../../components/Navbar";
import {FaArrowLeft} from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function AusenciaProfessor() {
  const [ausencias, setAusencias] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [mesAusencia, setMesAusencia] = useState("");
  const [mesRegistro, setMesRegistro] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function carregarAusencias() {
      const resultado = await buscarAusencias();
      setAusencias(resultado);
    }
    carregarAusencias();
  }, []);

   useEffect(() => {
    const delayDebounce = setTimeout(() => {
      buscarComFiltro();
    }, 400); // 400ms debounce para evitar chamadas excessivas

    return () => clearTimeout(delayDebounce);
  }, [filtroNome, mesAusencia, mesRegistro]); // Reexecuta sempre que os filtros mudam

  const buscarComFiltro = async () => {
  const params = {};

  if (filtroNome) params.nome = filtroNome;
  if (mesAusencia) params.mesAusencia = parseInt(mesAusencia);
  if (mesRegistro) params.mesRegistro = parseInt(mesRegistro);

  try {
    const resultado = await buscarAusenciasComFiltro(params);
    setAusencias(resultado);
  } catch (error) {
    console.error("Erro ao buscar ausências com filtro:", error);
    alert("Erro ao buscar ausências. Verifique os filtros e tente novamente.");
  }
};
  return (
    <>
    <Navbar />
    <div className="pagina-ausencias">
        <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar">
        <FaArrowLeft />
        </div>
      <h2>Ausências de Professores</h2>
      <div className="filtros-ausencias">
  <input
        type="text"
        placeholder="Nome do professor"
        value={filtroNome}
        onChange={(e) => setFiltroNome(e.target.value)}
      />
      <input
        type="number"
        placeholder="Mês da ausência"
        value={mesAusencia}
        onChange={(e) => setMesAusencia(e.target.value)}
      />
      <input
        type="number"
        placeholder="Mês do registro"
        value={mesRegistro}
        onChange={(e) => setMesRegistro(e.target.value)}
      />
</div>

      {ausencias.length === 0 ? (
        <p className="sem-ausencias">Nenhuma ausência registrada.</p>
      ) : (
        <div className="tabela-ausencias">
          <div className="linha-cabecalho">
            <span>Professor</span>
            <span>Motivo</span>
            <span>Data da ausência</span>
            <span>Data do registro</span>
          </div>

          {ausencias.map((ausencia) => (
            <div className="linha-ausencia" key={ausencia.id}>
              <span>{ausencia.nomeProfessor}</span>
              <span>{ausencia.motivo}</span>
              <span>{ausencia.dataAusencia}</span>
              <span>{ausencia.dataRegistro}</span>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}


