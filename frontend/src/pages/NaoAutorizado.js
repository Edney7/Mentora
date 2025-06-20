import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NaoAutorizado() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Acesso Não Autorizado</h1>
      <p>Você não tem permissão para visualizar esta página.</p>
      <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Voltar
      </button>
    </div>
  );
}