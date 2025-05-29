import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Cadastro from './views/Cadastro';
import HomeSecretaria from './views/Secretaria/HomeSecreataria';
import HomeAluno from './views/Aluno/HomeAluno';
import HomeProfessor from './views/Professor/HomeProfessor';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/homeSecretaria" element={<HomeSecretaria/>} />
      <Route path="/homeProfessor" element={<HomeProfessor/>} />
      <Route path="/homeAluno" element={<HomeAluno/>} />
    </Routes>
  );
}
