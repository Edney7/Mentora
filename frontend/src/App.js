import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from "./components/ui/toaster";      // CAMINHO CORRIGIDO
import { Toaster as Sonner } from "./components/ui/sonner"; // CAMINHO CORRIGIDO
import { TooltipProvider } from "./components/ui/tooltip"; // CAMINHO CORRIGIDO
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar';

// 2. INICIALIZE O CLIENTE DO REACT QUERY
const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Mantive suas rotas originais que não mostram a Navbar
  const noNavbarRoutes = ['/', '/cadastro', '/esqueci-senha', '/redefinir-senha', '/nao-autorizado'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    // 3. ADICIONE O CONTAINER PRINCIPAL COM ESTILIZAÇÃO DE FUNDO
    <div className="min-h-screen bg-gray-50">
      {/* 4. ADICIONE OS NOVOS COMPONENTES DE NOTIFICAÇÃO */}
      <Toaster />
      <Sonner />

      {showNavbar && <Navbar onLogout={handleLogout} />}
      <AppRoutes />
    </div>
  );
}

// 5. ENVOLVA O APP COM TODOS OS PROVIDERS NECESSÁRIOS
export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
  );
}