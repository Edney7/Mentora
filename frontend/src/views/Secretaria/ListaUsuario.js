import React, { useEffect, useState } from "react";
import "../../styles/ListaUsuario.css";
import Navbar from "../../components/Navbar";
import { listarUsuario } from "../../services/ApiService";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ListaUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [sexo, setSexo] = useState("");

  const navigate = useNavigate();
console.log("Renderizou ListaUsuario");

  useEffect(() => {
      console.log("Chamando listarUsuario com:", nome, tipoUsuario, sexo);

    async function carregarUsuarios() {
      try {
        const response = await listarUsuario(nome, tipoUsuario, sexo);
        setUsuarios(response);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    }

    carregarUsuarios();
  }, [nome, tipoUsuario, sexo]);

  return (
    <>
      <Navbar onLogout={() => console.log("Logout clicado")} />
      <div className="usuarios-container">
        <div className="usuarios-header">
          <div className="voltar-seta" onClick={() => navigate(-1)}>
             <FaArrowLeft />
            </div>
          <h2>USUÁRIOS</h2>
<h4>Arrumar filtro, editar e botao do ativo</h4>
        <div className="usuarios-filtros">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <select value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
            <option value="">Tipo</option>
            <option value="SECRETARIA">Secretaria</option>
            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
          </select>
          <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
            <option value="">Sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
          <a href="/cadastro"> <button className="btn-add">+</button></a>
        </div>
</div>
        <div className="usuarios-lista">
          {usuarios.length === 0 ? (
            <p className="sem-usuarios">Nenhum usuário encontrado.</p>
          ) : (
            usuarios.map((usuario) => (
              <div className="usuario-row" key={usuario.id}>
                <div
                  className={`usuario-borda ${usuario.tipoUsuario.toLowerCase()}`}
                ></div>
                <div className="usuario-conteudo">
                  <div className="usuario-info">
                    <span>{usuario.nome}</span>
                    <span>{usuario.cpf}</span>
                    <span>{usuario.tipoUsuario}</span>
                    <span>{usuario.sexo}</span>
                    
                  </div>
                  <div className="usuario-acoes">
                    <button onClick={() => console.log("Editar", usuario.id)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => console.log("Excluir", usuario.id)}>
                      <FaTrash />
                    </button>
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
