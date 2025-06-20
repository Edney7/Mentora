// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { buscarUsuarioPorIdIncluindoInativos } from '../services/ApiService';
// import '../styles/DetalhesUsuario.css'; 
// import { FaUserCircle, FaEdit, FaKey, FaArrowLeft } from 'react-icons/fa';
// import { toast } from 'react-toastify'; // 1. Importa o toast

// export default function Perfil() {
//   const [usuario, setUsuario] = useState(null);
//   const [erro, setErro] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const carregarUsuarioLogado = useCallback(async () => {
//     const userId = localStorage.getItem('userId');
//     if (!userId) {
//       const errorMsg = 'ID do usuário não encontrado. Faça o login novamente.';
//       toast.error(errorMsg); // 2. Adiciona notificação de erro
//       setErro(errorMsg);
//       setLoading(false);
//       return;
//     }
//     try {
//       const dadosUsuario = await buscarUsuarioPorIdIncluindoInativos(userId);
//       setUsuario(dadosUsuario);
//     } catch (error) {
//       console.error("Erro ao carregar dados do usuário:", error);
//       const errorMsg = "Não foi possível carregar os dados do perfil.";
//       toast.error(errorMsg); // 2. Adiciona notificação de erro
//       setErro(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     carregarUsuarioLogado();
//   }, [carregarUsuarioLogado]);

//   if (loading) {
//     return <div className="detalhes-usuario-container"><p>Carregando perfil...</p></div>;
//   }

//   // A exibição de erro na tela foi mantida para uma melhor UX em caso de falha de carregamento
//   if (erro) {
//     return (
//       <div className="detalhes-usuario-container">
//         <p className="error-message">{erro}</p>
//         <button onClick={() => navigate(-1)} className="btn-acao btn-secundario" style={{width: 'auto', padding: '12px 20px', marginTop: '20px'}}>
//             <FaArrowLeft />
//             <span>Voltar</span>
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="detalhes-usuario-container">
//       {usuario && (
//         <>
//           <div className="usuario-header">
//             <div className="avatar-container">
//               <FaUserCircle size="100%" color="#ccc" />
//             </div>
//             <div>
//               <h1 className="nome-usuario">{usuario.nome}</h1>
//               <span className={`status-badge ${usuario.ativo ? 'status-ativo' : 'status-inativo'}`}>
//                 {usuario.ativo ? 'Ativo' : 'Inativo'}
//               </span>
//             </div>
//           </div>
//           <div className="usuario-grid">
//             <div className="painel-info-principal">
//               <div className="info-grupo">
//                 <h3>Informações Pessoais</h3>
//                 <div className="info-campo">
//                   <label>Nome Completo</label>
//                   <span>{usuario.nome}</span>
//                 </div>
//                 <div className="info-campo">
//                   <label>CPF</label>
//                   <span>{usuario.cpf}</span>
//                 </div>
//               </div>
//               <div className="info-grupo">
//                 <h3>Informações da Conta</h3>
//                 <div className="info-campo">
//                   <label>Email</label>
//                   <span>{usuario.email}</span>
//                 </div>
//                  <div className="info-campo">
//                   <label>Tipo de Usuário</label>
//                   <span>{usuario.tipoUsuario}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="painel-acoes">
//               <h3>Ações Rápidas</h3>
//               <div className="grupo-botoes">
//                 <button className="btn-acao btn-primario" onClick={() => navigate(`/secretaria/editarUsuario/${usuario.id}`)}>
//                   <FaEdit />
//                   <span>Editar Perfil</span>
//                 </button>
//                 <button className="btn-acao btn-secundario">
//                   <FaKey />
//                   <span>Alterar Senha</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="voltar-btn-container">
//              <button onClick={() => navigate(-1)} className="btn-acao btn-secundario" style={{width: 'auto', padding: '12px 20px'}}>
//                 <FaArrowLeft />
//                 <span>Voltar</span>
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }