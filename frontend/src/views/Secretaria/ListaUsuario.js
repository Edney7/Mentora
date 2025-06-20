import React, { useEffect, useState, useCallback } from "react";
import {
  listarTodosOsUsuarios,
  desativarUsuario,
  reativarUsuario,
} from "../../services/ApiService";
import "../../styles/secretaria/ListaUsuario.css";
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // 1. Importa o toast

export default function ListaUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [tipoUsuarioFiltro, setTipoUsuarioFiltro] = useState("");
  const [sexoFiltro, setSexoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const navigate = useNavigate();

  const carregarUsuarios = useCallback(async () => {
    setLoading(true);
    setErroApi("");
    try {
      const data = await listarTodosOsUsuarios();
      setUsuarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      const errorMsg = "Falha ao carregar usuários. Verifique a conexão e tente novamente.";
      toast.error(errorMsg); // 2. Notificação de erro no carregamento
      setErroApi(errorMsg);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleDesativar = async (id, nomeUsuario) => {
    if (window.confirm(`Tem certeza que deseja DESATIVAR o usuário "${nomeUsuario}"?`)) {
      try {
        await desativarUsuario(id);
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ativo: false } : u));
        // 3. Substituindo alert por toast
        toast.success(`Usuário "${nomeUsuario}" desativado com sucesso.`);
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
        // 3. Substituindo alert por toast
        toast.error(`Erro ao desativar usuário: ${errorMsg}`);
      }
    }
  };

  const handleReativar = async (id, nomeUsuario) => {
    if (window.confirm(`Tem certeza que deseja REATIVAR o usuário "${nomeUsuario}"?`)) {
      try {
        await reativarUsuario(id);
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ativo: true } : u));
        // 3. Substituindo alert por toast
        toast.success(`Usuário "${nomeUsuario}" reativado com sucesso.`);
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido.";
        // 3. Substituindo alert por toast
        toast.error(`Erro ao reativar usuário: ${errorMsg}`);
      }
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    let correspondeAoStatus = true;
    if (statusFiltro === "ATIVO") correspondeAoStatus = usuario.ativo === true;
    else if (statusFiltro === "INATIVO") correspondeAoStatus = usuario.ativo === false;
    
    const nomeMatch = nomeFiltro ? usuario.nome?.toLowerCase().includes(nomeFiltro.toLowerCase()) : true;
    const tipoMatch = tipoUsuarioFiltro ? usuario.tipoUsuario === tipoUsuarioFiltro : true;
    const sexoMatch = sexoFiltro ? usuario.sexo === sexoFiltro : true;

    return nomeMatch && tipoMatch && sexoMatch && correspondeAoStatus;
  });

  if (loading) {
    return <div className="usuarios-container"><p>Carregando usuários...</p></div>;
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar"><FaArrowLeft /></div>
        <h2>GERENCIAMENTO DE USUÁRIOS</h2>
        <div className="usuarios-filtros">
          <input type="text" placeholder="Nome" value={nomeFiltro} onChange={(e) => setNomeFiltro(e.target.value)} />
          <select value={tipoUsuarioFiltro} onChange={(e) => setTipoUsuarioFiltro(e.target.value)}>
            <option value="">Todos os Tipos</option>
            <option value="SECRETARIA">Secretaria</option>
            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
          </select>
          <select value={sexoFiltro} onChange={(e) => setSexoFiltro(e.target.value)}>
            <option value="">Todos os Sexos</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} className="usuario-filtro select">
            <option value="">Todos os Status</option>
            <option value="ATIVO">Apenas Ativos</option>
            <option value="INATIVO">Apenas Inativos</option>
          </select>
          <button onClick={() => navigate("/cadastro")} className="btn-usuario" title="Cadastrar Novo Usuário"><FaPlus /></button>
        </div>
      </div>
      {erroApi && <p className="error-message">{erroApi}</p>}
      <div className="usuarios-lista">
        {usuariosFiltrados.length === 0 && !loading ? (
          <p className="sem-usuarios">Nenhum usuário encontrado com os filtros aplicados.</p>
        ) : (
          usuariosFiltrados.map((usuario) => (
            <div className="usuario-row" key={usuario.id}>
              <div className={`usuario-borda ${usuario.tipoUsuario?.toLowerCase()}`}></div>
              <div className="usuario-conteudo">
                <div className="usuario-info">
                  <span><strong>Nome:</strong> {usuario.nome}</span>
                  <span><strong>CPF:</strong> {usuario.cpf}</span>
                  <span><strong>Email:</strong> {usuario.email}</span>
                  <span><strong>Tipo:</strong> {usuario.tipoUsuario}</span>
                  <span><strong>Sexo:</strong> {usuario.sexo}</span>
                  <span><strong>Nasc:</strong> {usuario.dtNascimento}</span>
                  <span>
                    <strong>Status:</strong>{" "}
                    <span>
                      {usuario.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </span>
                </div>
                <div className="usuario-acoes">
                  <button onClick={() => navigate(`/secretaria/editarUsuario/${usuario.id}`)} title="Editar Usuário"><FaEdit /></button>
                  {usuario.ativo ? (
                    <button onClick={() => handleDesativar(usuario.id, usuario.nome)} title="Desativar Usuário"><FaTrash /></button>
                  ) : (
                    <button onClick={() => handleReativar(usuario.id, usuario.nome)} title="Reativar Usuário" className="btn-action btn-reactivate"><FaRedo /></button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}