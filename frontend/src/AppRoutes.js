import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import NaoAutorizado from './views/NaoAutorizado';
import Perfil from './views/Perfil';
import Login from './views/Login';
import Cadastro from './views/Secretaria/Cadastro';
import HomeSecretaria from './views/Secretaria/HomeSecretaria';
import HomeProfessor from './views/Professor/HomeProfessor';
import SecretariaListaUsuarios from './views/Secretaria/ListaUsuario';
import SecretariaDisciplinas from './views/Secretaria/Disciplina';
import SecretariaTurmas from './views/Secretaria/ListaTurmas';
import SecretariaAusenciaProfessor from './views/Secretaria/AusenciaProfessor';
import SecretariaNotasPresencasAlunos from './views/Secretaria/NotasPresençasAlunos';
import SecretariaEditarUsuario from './views/Secretaria/EditarUsuario';
import DetalhesTurmas from './views/Secretaria/DetalhesTurma';
import TurmaDetalhe from './views/Professor/TurmaDetalhe';

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- ROTAS PÚBLICAS --- */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/nao-autorizado" element={<NaoAutorizado />} />

      {/* --- ROTAS PROTEGIDAS (PRECISA ESTAR LOGADO) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* --- ROTAS DA SECRETARIA (PRECISA ESTAR LOGADO E SER SECRETARIA) --- */}
      <Route element={<ProtectedRoute roles={['SECRETARIA']} />}>
        <Route path="/homeSecretaria" element={<HomeSecretaria/>} />
        <Route path="/secretaria/usuarios" element={<SecretariaListaUsuarios/>} />
        <Route path="/secretaria/disciplina" element={<SecretariaDisciplinas />} />
        <Route path="/secretaria/turmas" element={<SecretariaTurmas />} />
        <Route path="/secretaria/ausenciaProfessor" element={<SecretariaAusenciaProfessor />} />
        <Route path="/secretaria/notasPresencasAlunos" element={<SecretariaNotasPresencasAlunos />} />
        <Route path="/secretaria/editarUsuario/:id" element={<SecretariaEditarUsuario />} />
        <Route path="/secretaria/turmas/detalhes/:id" element={<DetalhesTurmas />} />
      </Route>
      
      {/* --- ROTAS DO PROFESSOR (PRECISA ESTAR LOGADO E SER PROFESSOR) --- */}
      <Route element={<ProtectedRoute roles={['PROFESSOR']} />}>
        <Route path="/homeProfessor" element={<HomeProfessor/>} />
        <Route path="/turmaDetalhe/:id" element={<TurmaDetalhe />} />
      </Route>
    </Routes>
  );
}