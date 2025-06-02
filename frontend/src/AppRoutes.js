import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Cadastro from './views/Cadastro';
import HomeSecretaria from './views/Secretaria/HomeSecretaria';
import HomeAluno from './views/Aluno/HomeAluno';
import HomeProfessor from './views/Professor/HomeProfessor';
import ListaUsuario from './views/Secretaria/ListaUsuario';
import Disciplina from './views/Secretaria/Disciplina';
import EditarDisciplina from './views/Secretaria/EditarDisciplina';
import CadastroDisciplina from './views/Secretaria/CadastroDisciplina';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/homeSecretaria" element={<HomeSecretaria/>} />
      <Route path="/homeProfessor" element={<HomeProfessor/>} />
      <Route path="/homeAluno" element={<HomeAluno/>} />
      <Route path="/listaUsuario" element={<ListaUsuario/>} />
      <Route path="/disciplina" element={<Disciplina/>} />
      <Route path="/editarDisciplina/:id" element={<EditarDisciplina />} />
      <Route path="/cadastroDisciplina" element={<CadastroDisciplina />} />
    </Routes>
  );
}
