import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ roles }) {
  const userId = localStorage.getItem('userId');
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(tipoUsuario)) {
    return <Navigate to="/nao-autorizado" replace />;
  }

  return <Outlet />;
}