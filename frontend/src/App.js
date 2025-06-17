// src/App.js

import React from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';

// 1. IMPORTE O TOASTIFY E O CSS DELE
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const noNavbarRoutes = ['/', '/cadastro', '/esqueci-senha', '/redefinir-senha'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* 2. ADICIONE O TOASTCONTAINER AQUI */}
      {/* Ele é invisível até que uma notificação seja disparada. */}
      {/* Você pode customizar a posição, tempo, tema, etc. */}
      <ToastContainer
        position="top-right"
        autoClose={5000} // Fecha após 5 segundos
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {showNavbar && <Navbar onLogout={handleLogout} />}
      <AppRoutes />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}