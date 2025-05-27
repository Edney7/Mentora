import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Cadastro from './views/Cadastro';
import HomeSecretaria from './views/HomeSecreataria';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/homeSecretaria" element={<HomeSecretaria/>} />
    </Routes>
  );
}
