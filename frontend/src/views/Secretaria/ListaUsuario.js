import React, { useEffect, useState, useCallback } from "react";
import "../../styles/listaUsuario.css"; // VERIFIQUE ESTE CAMINHO
import Navbar from "../../components/Navbar"; // VERIFIQUE ESTE CAMINHO
import {
  listarUsuario, // Para a secretaria ver todos
  desativarUsuario,
  reativarUsuario,
} from "../../services/ApiService"; // VERIFIQUE ESTE CAMINHO
import { FaEdit, FaTrash, FaArrowLeft, FaPlus, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from 'react-toastify'; // Opcional para feedback
// import 'react-toastify/dist/ReactToastify.css';

export default function ListaUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  // Renomeando estados de filtro para evitar conflito e maior clareza
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [tipoUsuarioFiltro, setTipoUsuarioFiltro] = useState("");
  const [sexoFiltro, setSexoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState(""); // "ATIVO", "INATIVO", ou "" para todos

  const [loading, setLoading] = useState(true);
  const [erroApi, setErroApi] = useState(""); // Estado para erros da API

  const navigate = useNavigate();

  const carregarUsuarios = useCallback(async () => {
    setLoading(true);
    setErroApi("");
    try {
      const filtros = {
        nome: nomeFiltro || undefined, // Envia undefined se vazio para não filtrar por string vazia no backend
        tipoUsuario: tipoUsuarioFiltro || undefined,
        sexo: sexoFiltro || undefined,
        // status: statusFiltro // Se o backend suportar filtro por status no endpoint listarTodosOsUsuarios
      };
      // Remove chaves com valor undefined para não enviar query params vazios
      Object.keys(filtros).forEach(
        (key) => filtros[key] === undefined && delete filtros[key]
      );

      const data = await listarUsuario(filtros); // Secretaria vê todos
      setUsuarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setErroApi(
        "Falha ao carregar usuários. Verifique a conexão e tente novamente."
      );
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [nomeFiltro, tipoUsuarioFiltro, sexoFiltro]); // Adicionar filtros como dependência

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]); // carregarUsuarios é agora dependência por causa do useCallback e seus filtros

  const handleDesativar = async (id, nomeUsuario) => {
    if (
      window.confirm(
        `Tem certeza que deseja DESATIVAR o usuário "${nomeUsuario}"?`
      )
    ) {
      try {
        await desativarUsuario(id);
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((u) => (u.id === id ? { ...u, ativo: false } : u))
        );
        alert(`Usuário "${nomeUsuario}" desativado com sucesso.`);
        // toast.success(`Usuário "${nomeUsuario}" desativado com sucesso.`);
      } catch (error) {
        console.error("Erro ao desativar usuário:", error);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Erro desconhecido.";
        alert(`Erro ao desativar usuário: ${errorMsg}`);
        // toast.error(`Erro ao desativar usuário: ${errorMsg}`);
      }
    }
  };

  const handleReativar = async (id, nomeUsuario) => {
    if (
      window.confirm(
        `Tem certeza que deseja REATIVAR o usuário "${nomeUsuario}"?`
      )
    ) {
      try {
        await reativarUsuario(id);
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((u) => (u.id === id ? { ...u, ativo: true } : u))
        );
        alert(`Usuário "${nomeUsuario}" reativado com sucesso.`);
        // toast.success(`Usuário "${nomeUsuario}" reativado com sucesso.`);
      } catch (error) {
        console.error("Erro ao reativar usuário:", error);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Erro desconhecido.";
        alert(`Erro ao reativar usuário: ${errorMsg}`);
        // toast.error(`Erro ao reativar usuário: ${errorMsg}`);
      }
    }
  };

  // Filtragem no frontend (se o backend não suportar todos os filtros ou para refinar)
  const usuariosFiltrados = usuarios.filter((usuario) => {
    // A filtragem por nome, tipo e sexo já foi feita no backend se os filtros foram passados
    // Aqui, podemos adicionar o filtro de status se ele for apenas frontend
    let correspondeAoStatus = true;
    if (statusFiltro === "ATIVO") {
      correspondeAoStatus = usuario.ativo === true;
    } else if (statusFiltro === "INATIVO") {
      correspondeAoStatus = usuario.ativo === false;
    }
    // Se os filtros principais (nome, tipo, sexo) já foram aplicados no backend,
    // esta filtragem de frontend pode ser simplificada ou focada apenas no statusFiltro.
    // Se o backend não filtrou, mantenha os outros filtros aqui:
    const nomeMatch = usuario.nome
      ?.toLowerCase()
      .includes(nomeFiltro.toLowerCase());
    const tipoMatch = tipoUsuarioFiltro
      ? usuario.tipoUsuario === tipoUsuarioFiltro
      : true;
    const sexoMatch = sexoFiltro ? usuario.sexo === sexoFiltro : true; // Ajuste para os valores exatos do seu backend (ex: "Masculino" vs "M")

    return nomeMatch && tipoMatch && sexoMatch && correspondeAoStatus;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="usuarios-container">
          <p>Carregando usuários...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <ToastContainer /> */}
      <Navbar onLogout={() => console.log("Logout placeholder")} />
      <div className="usuarios-container">
        <div className="usuarios-header">
          <div
            className="voltar-seta"
            onClick={() => navigate(-1)}
            title="Voltar"
          >
            <FaArrowLeft />
          </div>
          <h2>GERENCIAMENTO DE USUÁRIOS</h2>
          <div className="usuarios-filtros">
            <input
              type="text"
              placeholder="Nome"
              value={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}
            />
            <select
              value={tipoUsuarioFiltro}
              onChange={(e) => setTipoUsuarioFiltro(e.target.value)}
            >
              <option value="">Todos os Tipos</option>
              <option value="SECRETARIA">Secretaria</option>
              <option value="ALUNO">Aluno</option>
              <option value="PROFESSOR">Professor</option>
            </select>
            <select
              value={sexoFiltro}
              onChange={(e) => setSexoFiltro(e.target.value)}
            >
              <option value="">Todos os Sexos</option>
              <option value="Masculino">Masculino</option>{" "}
              {/* Certifique-se que estes valores correspondem aos do seu DTO/backend */}
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="ATIVO">Apenas Ativos</option>
              <option value="INATIVO">Apenas Inativos</option>
            </select>
            <button
              onClick={() => navigate("/cadastro")}
              className="btn-add"
              title="Cadastrar Novo Usuário"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {erroApi && <p className="error-message">{erroApi}</p>}

        <div className="usuarios-lista">
          {usuariosFiltrados.length === 0 && !loading ? (
            <p className="sem-usuarios">
              Nenhum usuário encontrado com os filtros aplicados.
            </p>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <div className="usuario-row" key={usuario.id}>
                <div
                  className={`usuario-borda ${usuario.tipoUsuario?.toLowerCase()}`}
                ></div>
                <div className="usuario-conteudo">
                  <div className="usuario-info">
                    <span>
                      <strong>Nome:</strong> {usuario.nome}
                    </span>
                    <span>
                      <strong>CPF:</strong> {usuario.cpf}
                    </span>
                    <span>
                      <strong>Email:</strong> {usuario.email}
                    </span>
                    <span>
                      <strong>Tipo:</strong> {usuario.tipoUsuario}
                    </span>
                    <span>
                      <strong>Sexo:</strong> {usuario.sexo}
                    </span>
                    <span>
                      <strong>Nasc:</strong> {usuario.dtNascimento}
                    </span>{" "}
                    {/* Formato da data do DTO */}
                    <span>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          usuario.ativo ? "status-ativo" : "status-inativo"
                        }
                      >
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </span>
                  </div>
                  <div className="usuario-acoes">
                    <button
                      onClick={() =>
                        alert(
                          `Editar usuário ID: ${usuario.id}. Funcionalidade a implementar.`
                        )
                      }
                      // onClick={() => navigate(`/secretaria/usuarios/editar/${usuario.id}`)} // Descomente quando a rota de edição existir
                      title="Editar Usuário"
                      disabled // Habilitar quando a tela de edição existir
                    >
                      <FaEdit />
                    </button>
                    {usuario.ativo ? (
                      <button
                        onClick={() =>
                          handleDesativar(usuario.id, usuario.nome)
                        }
                        title="Desativar Usuário"
                      >
                        <FaTrash />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReativar(usuario.id, usuario.nome)}
                        title="Reativar Usuário"
                        className="btn-action btn-reactivate"
                      >
                        {" "}
                        {/* Adicione a classe btn-action se quiser o mesmo estilo dos outros */}
                        <FaRedo />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
