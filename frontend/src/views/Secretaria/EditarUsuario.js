import react,{ useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { buscarUsuarioAtivoPorId, atualizarUsuario } from "../../services/ApiService";
import  "../../styles/secretaria/EditarUsuario.css";
import { FaArrowLeft } from "react-icons/fa";


export default function EditarUusario(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const dados = await buscarUsuarioAtivoPorId(id);
        setUsuario(dados);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        alert("Erro ao carregar dados do usuário.");
      }
    };

    carregarUsuario();
  }, [id]);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      await atualizarUsuario(id, usuario);
      alert("Usuário atualizado com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário.");
    }
  };

   if (!usuario) return <p>Carregando...</p>;
    return(
        <>
        <Navbar />
        <div
                    className="voltar-seta"
                    onClick={() => navigate(-1)}
                    title="Voltar"
                  >
                    <FaArrowLeft />
                  </div>
         <div className="form-editar-usuario">
        <h2>Editar Usuário</h2>
        <input
          type="text"
          name="nome"
          value={usuario.nome}
          onChange={handleChange}
          placeholder="Nome"
        />
        <input
          type="email"
          name="email"
          value={usuario.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <select
          name="sexo"
          value={usuario.sexo}
          onChange={handleChange}
        >
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Outro">Outro</option>
        </select>
        {/* Adicione outros campos que deseja editar */}
        <button onClick={handleSalvar}>Salvar Alterações</button>
      </div>
        </>
    )
}