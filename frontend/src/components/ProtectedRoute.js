// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ roles }) {
  // --- ALTERAÇÃO PRINCIPAL AQUI ---
  // Em vez de checar o token, checamos se o 'userId' existe no localStorage.
  // Se existir, consideramos o usuário como "logado".
  const userId = localStorage.getItem('userId');
  // --------------------------------

  // A verificação de cargo/role continua útil para autorização
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  // 1. O usuário está logado?
  if (!userId) {
    // Se não há userId, o usuário não está logado. Redireciona para a página de login.
    return <Navigate to="/" replace />;
  }

  // 2. O usuário tem permissão para esta rota? (Esta parte continua igual)
  if (roles && !roles.includes(tipoUsuario)) {
    // Se a rota exige um cargo e o usuário não o tem, redireciona.
    return <Navigate to="/nao-autorizado" replace />;
  }

  // Se o usuário está logado (e autorizado, se aplicável), mostra a página.
  return <Outlet />;
}