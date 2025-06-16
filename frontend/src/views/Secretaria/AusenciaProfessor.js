import React, { useEffect, useState } from "react";
import { buscarAusencias } from "../../services/ApiService"; 
import "../../styles/secretaria/AusenciaProfessor.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const parseDate = (dataString) => {
    if (!dataString) return null;
    let data;
    if (dataString.includes('/')) {
        const partes = dataString.split(' ')[0].split('/');
        if (partes.length === 3) {
            const [dia, mes, ano] = partes;
            data = new Date(ano, mes - 1, dia);
        }
    } else {
        data = new Date(dataString);
    }
    return !isNaN(data.getTime()) ? data : null;
};

export default function AusenciaProfessor() {
  const [todasAsAusencias, setTodasAsAusencias] = useState([]);
  const [ausenciasFiltradas, setAusenciasFiltradas] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [mesAusencia, setMesAusencia] = useState("");
  const [mesRegistro, setMesRegistro] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const carregarTodasAsAusencias = async () => {
      setLoading(true);
      setErro("");
      try {
        const resultado = await buscarAusencias();
        setTodasAsAusencias(resultado || []);
        setAusenciasFiltradas(resultado || []);
      } catch (error) {
        console.error("Erro ao carregar ausências:", error);
        setErro("Falha ao carregar a lista de ausências.");
      } finally {
        setLoading(false);
      }
    };
    carregarTodasAsAusencias();
  }, []);

  useEffect(() => {
    let ausenciasTemp = [...todasAsAusencias];

    if (filtroNome) {
      ausenciasTemp = ausenciasTemp.filter(a => a.nomeProfessor?.toLowerCase().includes(filtroNome.toLowerCase()));
    }
    if (mesAusencia) {
      const mesNum = parseInt(mesAusencia, 10);
      ausenciasTemp = ausenciasTemp.filter(a => {
        const data = parseDate(a.dataAusencia);
        return data && data.getMonth() + 1 === mesNum;
      });
    }
    if (mesRegistro) {
      const mesNum = parseInt(mesRegistro, 10);
      ausenciasTemp = ausenciasTemp.filter(a => {
        const data = parseDate(a.dataRegistro);
        return data && data.getMonth() + 1 === mesNum;
      });
    }
    setAusenciasFiltradas(ausenciasTemp);
  }, [filtroNome, mesAusencia, mesRegistro, todasAsAusencias]);

  return (
    <div className="pagina-ausencias">
      <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar"><FaArrowLeft /></div>
      <h2>Ausências de Professores</h2>
      <div className="filtros-ausencias">
        <div className="filtro-container">
          <input type="text" placeholder="Nome do professor" value={filtroNome} onChange={(e) => setFiltroNome(e.target.value)} />
        </div>
        <div className="filtro-container">
          <select value={mesAusencia} onChange={(e) => setMesAusencia(e.target.value)}>
            <option value="">Mês da Ausência (Todos)</option>
            {[...Array(12).keys()].map(i => <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}</option>)}
          </select>
        </div>
        <div className="filtro-container">
          <select value={mesRegistro} onChange={(e) => setMesRegistro(e.target.value)}>
            <option value="">Mês do Registro (Todos)</option>
            {[...Array(12).keys()].map(i => <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}</option>)}
          </select>
        </div>
      </div>
      {erro && <p className="sem-ausencias error-message">{erro}</p>}
      {loading ? (
        <p className="carregando-ausencias">Carregando ausências...</p>
      ) : ausenciasFiltradas.length === 0 && !erro ? (
        <p className="sem-ausencias">Nenhuma ausência encontrada para os filtros aplicados.</p>
      ) : (
        <div className="tabela-ausencias">
          <div className="linha-cabecalho-ausencia">
            <span>Professor</span>
            <span>Motivo</span>
            <span>Data da ausência</span>
            <span>Data do registro</span>
          </div>
          {ausenciasFiltradas.map((ausencia) => (
            <div className="linha-ausencia" key={ausencia.id}>
              <span>{ausencia.nomeProfessor}</span>
              <span>{ausencia.motivo}</span>
              <span>{ausencia.dataAusencia || "-"}</span>
              <span>{ausencia.dataRegistro || "-"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}