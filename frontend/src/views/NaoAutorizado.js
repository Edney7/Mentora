import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NaoAutorizado() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '80vh', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ color: '#dc3545', fontSize: '3rem' }}>Acesso Negado</h1>
      <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>
        Você não tem permissão para visualizar esta página.
      </p>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          padding: '12px 25px', 
          fontSize: '1rem', 
          cursor: 'pointer', 
          marginTop: '20px',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#007bff',
          color: 'white'
        }}
      >
        Voltar
      </button>
    </div>
  );
}