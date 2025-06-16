import React from 'react';
// 1. Importe os hooks necessários e o BrowserRouter
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';

// 2. Importe seus componentes
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';

// 3. Crie um componente interno para acessar os hooks do router
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // 4. Defina a função de logout aqui
  const handleLogout = () => {
    // Limpa todos os dados salvos
    localStorage.clear();
    // Redireciona para a página de login
    navigate('/');
  };

  // 5. Defina em quais páginas o Navbar NÃO deve aparecer
  const noNavbarRoutes = ['/', '/cadastro'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* O Navbar será renderizado condicionalmente */}
      {showNavbar && <Navbar onLogout={handleLogout} />}
      
      {/* Suas rotas são renderizadas aqui */}
      <AppRoutes />
    </>
  );
}

// O componente App principal que exportamos
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;