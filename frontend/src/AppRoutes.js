import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Componentes
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas
import Login from './pages/Login';
import NaoAutorizado from './pages/NaoAutorizado';
import Perfil from './pages/Perfil';

// Páginas da Secretaria
import HomeSecretaria from './pages/Secretaria/HomeSecretaria';
import ListaUsuarios from './pages/Secretaria/ListaUsuarios';
import Disciplina from './pages/Secretaria/Disciplina';
import ListaTurmas from './pages/Secretaria/ListaTurmas';
import AusenciaProfessor from './pages/Secretaria/AusenciaProfessor';
import NotasPresencasAlunos from './pages/Secretaria/NotasPresencasAlunos';
import EditarUsuario from './pages/Secretaria/EditarUsuario';
import DetalhesTurma from './pages/Secretaria/DetalhesTurma';

// Página de Cadastro (import que faltava)
import Cadastro from './pages/Secretaria/Cadastro';

// Páginas do Professor
import HomeProfessor from './pages/Professor/HomeProfessor';
import TurmaDetalhe from './pages/Professor/TurmaDetalhe';
import MeuPerfil from './pages/Professor/MeuPerfil';


export default function AppRoutes() {
  return (
    <Routes>
      {/* --- ROTAS PÚBLICAS --- */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} /> {/* Esta linha agora funciona */}
      <Route path="/nao-autorizado" element={<NaoAutorizado />} />

      {/* --- ROTAS PROTEGIDAS (PRECISA ESTAR LOGADO) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* --- ROTAS DA SECRETARIA --- */}
      <Route element={<ProtectedRoute roles={['SECRETARIA']} />}>
        <Route path="/homeSecretaria" element={<HomeSecretaria />} />
        <Route path="/secretaria/usuarios" element={<ListaUsuarios />} />
        <Route path="/secretaria/disciplina" element={<Disciplina />} />
        <Route path="/secretaria/turmas" element={<ListaTurmas />} />
        <Route path="/secretaria/ausenciaProfessor" element={<AusenciaProfessor />} />
        <Route path="/secretaria/notasPresencasAlunos" element={<NotasPresencasAlunos />} />
        <Route path="/secretaria/editarUsuario/:id" element={<EditarUsuario />} />
        <Route path="/secretaria/turmas/detalhes/:id" element={<DetalhesTurma />} />
      </Route>
      
      {/* --- ROTAS DO PROFESSOR --- */}
      <Route element={<ProtectedRoute roles={['PROFESSOR']} />}>
        <Route path="/homeProfessor" element={<HomeProfessor />} />
        <Route path="/turmaDetalhe/:id" element={<TurmaDetalhe />} />
        <Route path="/professor/perfil" element={<MeuPerfil />} />
      </Route>
    </Routes>
  );
}