import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// IMPORT CORRIGIDO AQUI
import { Menu, X, User, LogOut, Home, Users, Bookmark, Building, CalendarX } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const tipoUsuario = localStorage.getItem('tipoUsuario');
  const userName = localStorage.getItem('userName') || 'Usuário';

  const getNavItems = () => {
    switch (tipoUsuario?.toUpperCase()) {
      case 'SECRETARIA':
        return [
          { path: '/homeSecretaria', label: 'Dashboard', icon: Home },
          { path: '/secretaria/usuarios', label: 'Usuários', icon: Users },
          { path: '/secretaria/turmas', label: 'Turmas', icon: Building },
          // USO DO ÍCONE CORRIGIDO AQUI
          { path: '/secretaria/disciplina', label: 'Disciplinas', icon: Bookmark },
          { path: '/secretaria/ausenciaProfessor', label: 'Ausências', icon: CalendarX },
        ];
      case 'PROFESSOR':
        return [
          { path: '/homeProfessor', label: 'Dashboard', icon: Home },
          { path: '/professor/perfil', label: 'Meu Perfil', icon: User },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold">Sistema Escolar</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                      location.pathname === item.path
                        ? 'bg-teal-800 text-white'
                        : 'text-teal-100 hover:bg-teal-700 hover:text-white'
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center ml-4 space-x-3">
            <span className="text-white text-sm">Olá, {userName}</span>
            <button
              onClick={onLogout}
              className="text-teal-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-teal-100 hover:text-white p-2 rounded-md"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-teal-700">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-teal-800 text-white'
                    : 'text-teal-100 hover:bg-teal-600 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-teal-600 pt-4 mt-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:bg-teal-600 hover:text-white"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;