// src/views/Perfil.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarUsuarioPorIdIncluindoInativos } from '../services/ApiService';
import '../styles/DetalhesUsuario.css'; // Usando o novo CSS

// Importando ícones para um visual mais agradável
import { FaUserCircle, FaEdit, FaKey, FaArrowLeft } from 'react-icons/fa';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const carregarUsuarioLogado = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setErro('ID do usuário não encontrado. Faça o login novamente.');
      setLoading(false);
      return;
    }
    try {
      const dadosUsuario = await buscarUsuarioPorIdIncluindoInativos(userId);
      setUsuario(dadosUsuario);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setErro("Não foi possível carregar os dados do perfil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarioLogado();
  }, [carregarUsuarioLogado]);

  // Usando o novo container para as telas de loading e erro
  if (loading) {
    return <div className="detalhes-usuario-container"><p>Carregando perfil...</p></div>;
  }

  if (erro) {
    return <div className="detalhes-usuario-container"><p className="error-message">{erro}</p></div>;
  }

  return (
    // O JSX foi completamente reestruturado para usar o novo CSS
    <div className="detalhes-usuario-container">
      {usuario && (
        <>
          {/* --- CABEÇALHO --- */}
          <div className="usuario-header">
            <div className="avatar-container">
              {/* Usando um ícone como placeholder para o avatar */}
              <FaUserCircle size="100%" color="#ccc" />
            </div>
            <div>
              <h1 className="nome-usuario">{usuario.nome}</h1>
              <span className={`status-badge ${usuario.ativo ? 'status-ativo' : 'status-inativo'}`}>
                {usuario.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          {/* --- GRID PRINCIPAL --- */}
          <div className="usuario-grid">
            
            {/* PAINEL DA ESQUERDA (INFORMAÇÕES) */}
            <div className="painel-info-principal">
              <div className="info-grupo">
                <h3>Informações Pessoais</h3>
                <div className="info-campo">
                  <label>Nome Completo</label>
                  <span>{usuario.nome}</span>
                </div>
                <div className="info-campo">
                  <label>CPF</label>
                  <span>{usuario.cpf}</span>
                </div>
              </div>

              <div className="info-grupo">
                <h3>Informações da Conta</h3>
                <div className="info-campo">
                  <label>Email</label>
                  <span>{usuario.email}</span>
                </div>
                 <div className="info-campo">
                  <label>Tipo de Usuário</label>
                  <span>{usuario.tipoUsuario}</span>
                </div>
              </div>
            </div>

            {/* PAINEL DA DIREITA (AÇÕES) */}
            <div className="painel-acoes">
              <h3>Ações Rápidas</h3>
              <div className="grupo-botoes">
                <button className="btn-acao btn-primario" onClick={() => navigate(`/secretaria/editarUsuario/${usuario.id}`)}>
                  <FaEdit />
                  <span>Editar Perfil</span>
                </button>
                <button className="btn-acao btn-secundario">
                  <FaKey />
                  <span>Alterar Senha</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="voltar-btn-container">
             <button onClick={() => navigate(-1)} className="btn-acao btn-secundario" style={{width: 'auto', padding: '12px 20px'}}>
                <FaArrowLeft />
                <span>Voltar</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}