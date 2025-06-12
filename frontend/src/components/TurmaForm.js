// Sugestão de caminho: src/components/TurmaForm.jsx ou src/views/Secretaria/Turma/components/TurmaForm.jsx
import React, { useState, useEffect } from 'react';
import "../styles/FormularioModal.css";


const TurmaForm = ({ onSubmit, onClose, initialData, isEditing }) => {
  const [nome, setNome] = useState('');
  const [turno, setTurno] = useState('');
  const [serieAno, setSerieAno] = useState('');
  const [anoLetivo, setAnoLetivo] = useState(new Date().getFullYear().toString());
  const [ativa, setAtiva] = useState(true);
  const [erroInterno, setErroInterno] = useState('');

  useEffect(() => {
    if (isEditing && initialData) {
      setNome(initialData.nome || '');
      setTurno(initialData.turno || '');
      setSerieAno(initialData.serieAno || '');
      setAnoLetivo(initialData.anoLetivo?.toString() || new Date().getFullYear().toString());
      setAtiva(initialData.ativa !== undefined ? initialData.ativa : true);
    } else {
      setNome('');
      setTurno('');
      setSerieAno('');
      setAnoLetivo(new Date().getFullYear().toString());
      setAtiva(true);
    }
  }, [initialData, isEditing]);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setErroInterno('');
    if (!nome.trim() || !serieAno.trim() || !anoLetivo.trim()) {
      setErroInterno("Nome, Série/Ano e Ano Letivo são obrigatórios.");
      return;
    }
    onSubmit({ 
      id: isEditing && initialData ? initialData.id : undefined,
      nome,
      turno,
      serieAno,
      anoLetivo: parseInt(anoLetivo, 10),
      ativa
    });
  };

  return (
    <form onSubmit={handleSubmitForm} className="form-turma"> 
      {erroInterno && <p className="error-message" style={{marginBottom: '15px'}}>{erroInterno}</p>}
      
      <div className="form-group">
        <label htmlFor="turma-nome-modal">Nome da Turma:</label>
        <input
          type="text"
          id="turma-nome-modal"
          placeholder="Ex: 1º Ano A - Integral"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          minLength={3}
          maxLength={100}
        />
        <div className='grid-turma'>
        <label htmlFor="turma-turno-modal">Turno:</label>
        <select 
            id="turma-turno-modal" 
            value={turno} 
            onChange={(e) => setTurno(e.target.value)}
        >
          <option value="">Selecione o Turno</option>
          <option value="Manhã">Manhã</option>
          <option value="Tarde">Tarde</option>
          <option value="Noite">Noite</option>
          <option value="Integral">Integral</option>
        </select>
    
        <label htmlFor="turma-serieAno-modal">Série/Ano:</label>
        <input
          type="text"
          id="turma-serieAno-modal"
          placeholder="Ex: 1º Ano"
          value={serieAno}
          onChange={(e) => setSerieAno(e.target.value)}
          required
        />
      
        <label htmlFor="turma-anoLetivo-modal">Ano Letivo:</label>
        <input
          type="number"
          id="turma-anoLetivo-modal"
          placeholder="Ex: 2025"
          value={anoLetivo}
          onChange={(e) => setAnoLetivo(e.target.value)}
          required
        />
        </div>
        <label htmlFor="turma-ativa-modal" className="checkbox-label">
          <input
            type="checkbox"
            id="turma-ativa-modal"
            checked={ativa}
            onChange={(e) => setAtiva(e.target.checked)}
          />
          Turma Ativa
        </label>
      
      <div className="form-actions-modal" style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
        <button type="submit" className="btn-salvar-modal">
          {isEditing ? "Salvar Alterações" : "Cadastrar Turma"}
        </button>
        <button type="button" onClick={onClose} className="btn-cancelar-modal secondary">
          Cancelar
        </button>
      </div>
      </div>
    </form>
  );
};

export default TurmaForm;
