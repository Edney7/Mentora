import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/TurmaDetalhe.css";

const alunosMock = [
  { id: 1, nome: "aluno da silva de souza" },
  { id: 2, nome: "aluno pedro" },
  { id: 3, nome: "aluno da silva" },
  { id: 4, nome: "aluno antonio" },
  { id: 5, nome: "aluno silveira" },
];

export default function TurmaDetalhe() {
  const { id } = useParams();
  const [alunoSelecionado, setAlunoSelecionado] = useState(alunosMock[0]);
  const [presencas, setPresencas] = useState({});
  const [notas, setNotas] = useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const [bimestreSelecionado, setBimestreSelecionado] = useState(null);
  const [tipoNota, setTipoNota] = useState("");
  const [valorNota, setValorNota] = useState("");

  const handleToggle = (alunoId, tipo) => {
    setPresencas((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        [tipo]: !prev[alunoId]?.[tipo],
      },
    }));
  };

  const abrirModalNota = (bimestre) => {
    setBimestreSelecionado(bimestre);
    setTipoNota("");
    setValorNota("");
    setModalAberto(true);
  };

  const salvarNota = () => {
    if (!tipoNota || !valorNota) return alert("Preencha todos os campos!");
    setNotas((prev) => ({
      ...prev,
      [alunoSelecionado.id]: {
        ...prev[alunoSelecionado.id],
        [bimestreSelecionado]: {
          ...(prev[alunoSelecionado.id]?.[bimestreSelecionado] || {}),
          [tipoNota]: valorNota,
        },
      },
    }));
    setModalAberto(false);
  };

  return (
    <div className="turma-detalhe-container">
      <h1>{`TURMA ${id}`}</h1>

      <div className="conteudo">
        <div className="alunos-coluna">
          <div className="alunos-header">ALUNOS</div>
          {alunosMock.map((aluno) => (
            <div
              key={aluno.id}
              className={`aluno-item ${
                alunoSelecionado.id === aluno.id ? "selecionado" : ""
              }`}
              onClick={() => setAlunoSelecionado(aluno)}
            >
              <span>{aluno.nome}</span>
              <input
                type="checkbox"
                checked={presencas[aluno.id]?.presenca || false}
                onChange={() => handleToggle(aluno.id, "presenca")}
              />
              <input
                type="checkbox"
                checked={presencas[aluno.id]?.falta || false}
                onChange={() => handleToggle(aluno.id, "falta")}
              />
            </div>
          ))}
        </div>

        <div className="notas-coluna">
          <div className="notas-header">
            NOTAS - {alunoSelecionado.nome.toLowerCase()}
          </div>

          {[1, 2, 3, 4].map((bim) => {
            const nota = notas[alunoSelecionado.id]?.[bim];
            return (
              <div key={bim}>
                <strong>{bim}° Bimestre</strong>
                {nota ? (
                  <div>
                    {Object.entries(nota).map(([tipo, valor]) => (
                      <p key={tipo}>
                        {tipo}: {valor}
                      </p>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => abrirModalNota(bim)}>
                    Adicionar nota
                  </button>
                )}
              </div>
            );
          })}

          <button className="btn-enviar">ENVIAR</button>
        </div>
      </div>

      {modalAberto && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Lançar Nota</h3>
            <label>
              Tipo:
              <select
                value={tipoNota}
                onChange={(e) => setTipoNota(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="prova">Prova</option>
                <option value="prova2">Prova 2</option>
              </select>
            </label>
            <label>
              Nota:
              <input
                type="number"
                value={valorNota}
                onChange={(e) => setValorNota(e.target.value)}
              />
            </label>
            <button onClick={salvarNota}>ENVIAR</button>
          </div>
        </div>
      )}
    </div>
  );
}
