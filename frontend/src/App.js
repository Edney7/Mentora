import React from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const noNavbarRoutes = ['/', '/cadastro'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
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