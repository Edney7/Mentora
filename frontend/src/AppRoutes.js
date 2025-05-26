import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Cadastro from './views/Cadastro';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </Routes>
  );
}
