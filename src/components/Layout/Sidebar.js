import React from 'react';
import { CATEGORIES, PAGES } from '../../utils/constants';
import CaffeIcon from '../ui/CaffeIcon';
import ToggleArrow from '../ui/ToggleArrow';

const Sidebar = ({ 
  selectedCategory, 
  onCategoryChange, 
  isCollapsed, 
  onToggleCollapse,
  darkMode = false,
  className = "",
  currentPage,
  onNavigate,
  onOpenAdmin,
  isAdmin = false
}) => {
  const categories = [
    { key: CATEGORIES.ALL, icon: '🍽️', label: 'Todos' },
    { key: CATEGORIES.COFFEE, icon: '☕', label: 'Cafés' },
    { key: CATEGORIES.TEA, icon: '🍵', label: 'Chás' },
    { key: CATEGORIES.SNACKS, icon: '🥐', label: 'Salgados' },
    { key: CATEGORIES.SWEETS, icon: '🧁', label: 'Doces' },
    { key: CATEGORIES.DRINKS, icon: '🥤', label: 'Bebidas' }
  ];

  const mainPages = [
    { key: PAGES.MENU, icon: '☕', label: 'Cardápio' },
    { key: PAGES.HISTORY, icon: '📋', label: 'Meus Pedidos' },
    { key: PAGES.RESERVATION, icon: '🗓️', label: 'Reservar Mesa' },
    { key: PAGES.ACCOUNT, icon: '👤', label: 'Minha Conta' }
  ];

  return (
    <div className={`shadow-2xl border-r transition-all duration-300 relative h-full flex flex-col justify-between overflow-y-auto ${
      darkMode ? 'bg-gray-900 border-gray-800 text-gray-200' : 'sidebar-gradient border-gray-200 text-gray-700'
    } ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      {/* Toggle Button - Transparente na borda da sidebar (apenas desktop) */}
      <button
        onClick={onToggleCollapse}
        className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 
                   bg-amber-600/80 hover:bg-amber-700 backdrop-blur-sm
                   text-white p-2 rounded-full shadow-lg border border-amber-500/30
                   transition-all duration-300 w-7 h-7 items-center justify-center"
        aria-label={isCollapsed ? "Abrir menu" : "Fechar menu"}
      >
        <ToggleArrow isCollapsed={isCollapsed} className="w-4 h-4" />
      </button>

      {/* Top Section: Logo, Páginas Principais (Mobile) e Categorias */}
      <div className={isCollapsed ? 'p-2' : 'p-4 sm:p-6'}>
        {/* Header com Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <CaffeIcon className="w-6 h-6" color="white" />
            </div>
            {!isCollapsed && (
              <span className={`text-2xl font-bold ml-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <span className="text-amber-500">C</span>affe
              </span>
            )}
          </div>
        </div>

        {/* Páginas Principais (Exibidas quando expandido, essencial para celular) */}
        {!isCollapsed && (
          <div className="mb-6 space-y-1 md:hidden">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 px-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Navegação
            </div>
            {mainPages.map((page) => (
              <button
                key={page.key}
                onClick={() => onNavigate && onNavigate(page.key)}
                className={`w-full flex items-center text-left rounded-xl px-4 py-2.5 transition-all text-sm font-medium ${
                  currentPage === page.key
                    ? 'bg-amber-600 text-white shadow-sm'
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-white hover:shadow-sm'
                }`}
              >
                <span className="text-lg mr-3">{page.icon}</span>
                <span>{page.label}</span>
              </button>
            ))}

            {/* Acesso Admin no mobile */}
            <button
              onClick={onOpenAdmin}
              className={`w-full flex items-center text-left rounded-xl px-4 py-2.5 transition-all text-sm font-medium ${
                isAdmin 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-white'
              }`}
            >
              <span className="text-lg mr-3">🛡️</span>
              <span>{isAdmin ? 'Admin (Ativo)' : 'Painel Admin'}</span>
            </button>
            <hr className={`my-4 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`} />
          </div>
        )}

        {/* Navegação de Categorias */}
        <nav className="space-y-1.5">
          {!isCollapsed && (
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 px-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Cardápio
            </div>
          )}
          
          {categories.map(category => (
            <button 
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              className={`w-full flex items-center text-left rounded-xl transition-all duration-200 group ${
                selectedCategory === category.key 
                  ? 'bg-amber-500 text-white shadow-md font-semibold' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
              } ${isCollapsed ? 'justify-center py-3 px-0' : 'px-4 py-2.5'}`}
              title={isCollapsed ? category.label : ''}
            >
              <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium text-sm ml-3 truncate">
                  {category.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Botão Ajustes e Preferências */}
      <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <button
          onClick={() => onNavigate && onNavigate(PAGES.ACCOUNT)}
          className={`w-full flex items-center text-left rounded-xl transition-all duration-200 group ${
            currentPage === PAGES.ACCOUNT
              ? 'bg-amber-500 text-white shadow-md font-semibold'
              : darkMode
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-700 hover:bg-white hover:shadow-md'
          } ${isCollapsed ? 'justify-center py-2.5 px-0' : 'px-4 py-2.5'}`}
          title={isCollapsed ? "Ajustes e Preferências" : ""}
        >
          <span className="text-lg flex-shrink-0 group-hover:rotate-45 transition-transform duration-200">
            ⚙️
          </span>
          {!isCollapsed && (
            <span className="font-medium text-sm ml-3 truncate">
              Ajustes
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
