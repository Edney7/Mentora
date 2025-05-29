import React ,{useEffect, useState}from "react";
import "../../styles/ListaUsuario.css";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function ListaUsuario(){
    const [usuarios, setUsuarios] = useState([]);

        useEffect(() => {
          axios.get("http://localhost:8080/api/usuarios")
            .then(res => setUsuarios(res.data))
            .catch(err => console.error("Erro ao buscar usuários", err));
        }, []);
     
        return (
            <>
           <Navbar onLogout={() => console.log("Logout clicado")} />
          <div className="usuarios-container">
            <div className="usuarios-header">
              <h2>USUÁRIOS</h2>
              <div className="filtros">
                <input type="text" placeholder="Nome" />
                <select><option>Tipo</option></select>
                <select><option>Sexo</option></select>
                <select><option>Ativo</option></select>
                <button className="btn-add">+</button>
              </div>
            </div>
            <div className="usuarios-lista">
              {usuarios.map((usuario, index) => (
                <div className="usuario-item" key={index}>
                  <div className={`barra-lateral ${usuario.tipo.toLowerCase()}`}></div>
                  <div className="info-nome">{usuario.nome}</div>
                  <div className="info-doc">{usuario.cpf ?? '000.000.000-00'}</div>
                  <div className="info-tipo">{usuario.tipo}</div>
                  <div className="info-sexo">{usuario.sexo}</div>
                  <div className="acoes">
                    <button className="btn-editar">✎</button>
                    <button className="btn-excluir">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>
        );
    
}