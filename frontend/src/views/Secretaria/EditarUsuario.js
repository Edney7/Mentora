import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarUsuarioPorIdIncluindoInativos, atualizarUsuario } from "../../services/ApiService";
import "../../styles/secretaria/EditarUsuario.css";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from 'react-toastify'; // 1. Importa o toast

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const carregarUsuario = async () => {
      setLoading(true);
      setErro("");
      try {
        const dados = await buscarUsuarioPorIdIncluindoInativos(id);
        setUsuario(dados);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        const errorMsg = "Erro ao carregar dados do usuário. Verifique a conexão e tente novamente.";
        toast.error(errorMsg); // 2. Notificação de erro no carregamento
        setErro(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSaving(true);
    // setErro(""); // Não é mais necessário para o erro do formulário

    try {
      await atualizarUsuario(id, usuario);
      toast.success("Usuário atualizado com sucesso!"); // 3. Notificação de sucesso
      navigate(-1);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      const errorMsg = error.response?.data?.message || "Ocorreu um erro ao salvar as alterações.";
      toast.error(errorMsg); // 3. Notificação de erro
      // setErro(errorMsg); // Removido em favor do toast
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="editar-usuario-container"><p>Carregando usuário...</p></div>;
  }

  // A mensagem de erro de carregamento inicial é mantida
  if (erro && !usuario) {
    return (
        <div className="editar-usuario-container">
            <header className="editar-usuario-header">
                <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar">
                    <FaArrowLeft />
                </div>
                <h2>Erro</h2>
            </header>
            <p className="error-message">{erro}</p>
        </div>
    );
  }

  return (
    <div className="editar-usuario-container">
      <header className="editar-usuario-header">
        <div className="voltar-seta" onClick={() => navigate(-1)} title="Voltar">
          <FaArrowLeft />
        </div>
        <h2>Editar Usuário</h2>
      </header>

      <form className="form-editar-usuario" onSubmit={handleSalvar}>
        <div className="form-grupo">
          <label htmlFor="nome">Nome Completo</label>
          <input
            id="nome"
            type="text"
            name="nome"
            value={usuario.nome || ''}
            onChange={handleChange}
            placeholder="Nome"
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={usuario.email || ''}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
        
        <div className="form-grupo">
          <label htmlFor="sexo">Sexo</label>
          <select
            id="sexo"
            name="sexo"
            value={usuario.sexo || ''}
            onChange={handleChange}
          >
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        
        {/* 4. Mensagem de erro do formulário removida em favor do toast */}
        {/* {erro && <p className="error-message">{erro}</p>} */}

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}