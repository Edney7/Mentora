import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { buscarUsuarioPorIdIncluindoInativos } from '../../services/ApiService';
import '../../styles/DetalhesUsuario.css'; // Reutilizando o mesmo estilo visual
import { FaUserCircle, FaArrowLeft } from 'react-icons/fa';

export default function MeuPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const carregarUsuarioLogado = useCallback(async () => {
    // A lógica é a mesma: busca os dados do usuário logado pelo ID salvo.
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

  if (loading) {
    return <div className="detalhes-usuario-container"><p>Carregando perfil...</p></div>;
  }

  if (erro) {
    return <div className="detalhes-usuario-container"><p className="error-message">{erro}</p></div>;
  }

  return (
    <div className="detalhes-usuario-container">
      {usuario && (
        <>
          <header className="editar-usuario-header">
            <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar">
                <FaArrowLeft />
            </div>
            <h2>Meu Perfil</h2>
          </header>
          
          <div className="usuario-header">
            <div className="avatar-container">
              <FaUserCircle size="100%" color="#ccc" />
            </div>
            <div>
              <h1 className="nome-usuario">{usuario.nome}</h1>
              <span className={`status-badge ${usuario.ativo ? 'status-ativo' : 'status-inativo'}`}>
                {usuario.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
          
          {/* Layout de coluna única, já que não há painel de ações */}
          <div className="painel-info-principal" style={{marginTop: '20px'}}>
            <div className="info-grupo">
              <h3>Informações Pessoais</h3>
              <div className="info-campo"><label>Nome Completo</label><span>{usuario.nome}</span></div>
              <div className="info-campo"><label>CPF</label><span>{usuario.cpf}</span></div>
            </div>
            <div className="info-grupo">
              <h3>Informações da Conta</h3>
              <div className="info-campo"><label>Email</label><span>{usuario.email}</span></div>
              <div className="info-campo"><label>Tipo de Usuário</label><span>{usuario.tipoUsuario}</span></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}