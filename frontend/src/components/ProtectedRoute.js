// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ roles }) => {
  // A verificação agora é baseada no userId, não no token
  const userId = localStorage.getItem('userId');
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  if (!userId) {
    // Se não há userId, o usuário não está logado. Redireciona para o login.
    return <Navigate to="/" replace />;
  }

  // A lógica de verificação de papéis (roles) continua a mesma
  if (roles && !roles.includes(tipoUsuario?.toUpperCase() || '')) {
    return <Navigate to="/nao-autorizado" replace />;
  }

  // Se o usuário está logado e tem permissão, renderiza a rota filha
  return <Outlet />;
};

export default ProtectedRoute;