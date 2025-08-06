import React from 'react';
import { CATEGORIES } from '../../utils/constants';
import CaffeIcon from '../ui/CaffeIcon';
import ToggleArrow from '../ui/ToggleArrow';

const Sidebar = ({ 
  selectedCategory, 
  onCategoryChange, 
  onPageChange, 
  isCollapsed, 
  onToggleCollapse,
  className = ""
}) => {
  const categories = [
    { key: CATEGORIES.ALL, icon: '🍽️', label: 'Todos' },
    { key: CATEGORIES.COFFEE, icon: '☕', label: 'Cafés' },
    { key: CATEGORIES.TEA, icon: '🍵', label: 'Chás' },
    { key: CATEGORIES.SNACKS, icon: '🥐', label: 'Salgados' },
    { key: CATEGORIES.SWEETS, icon: '🧁', label: 'Doces' },
    { key: CATEGORIES.DRINKS, icon: '🥤', label: 'Bebidas' }
  ];

  const menuItems = [
    { key: 'account', icon: '👤', label: 'Minha Conta' },
    { key: 'history', icon: '📜', label: 'Meus Pedidos' },
    { key: 'reservation', icon: '🗓️', label: 'Reservas' }
  ];

  return (
    <div className={`sidebar-gradient shadow-2xl border-r border-gray-200 transition-all duration-300 relative ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      {/* Toggle Button - Dentro da sidebar, transparente */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 
                   bg-amber-600/70 hover:bg-amber-700/80 backdrop-blur-sm
                   text-white p-2 rounded-full shadow-lg border border-amber-500/30
                   transition-all duration-300 w-7 h-7 flex items-center justify-center"
        aria-label={isCollapsed ? "Abrir menu" : "Fechar menu"}
      >
        <ToggleArrow isCollapsed={isCollapsed} className="w-4 h-4" />
      </button>

      <div className="p-6">
        {/* Header com Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <CaffeIcon className="w-6 h-6" color="white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">
              <span className="text-amber-600">C</span>affe
            </span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="space-y-2">
          {/* Seção Categorias */}
          <div className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3 transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`}>
            {!isCollapsed && 'Categorias'}
          </div>
          
          {categories.map(category => (
            <button 
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                selectedCategory === category.key 
                  ? 'bg-amber-100 text-amber-700 shadow-md' 
                  : 'text-gray-700 hover:bg-white hover:shadow-md'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? category.label : ''}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              <span className={`font-medium ml-3 transition-opacity duration-300 ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}>
                {category.label}
              </span>
            </button>
          ))}

          <hr className={`my-6 border-gray-200 transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`} />

          {/* Seção Conta */}
          <div className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3 transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`}>
            {!isCollapsed && 'Conta'}
          </div>
          
          {menuItems.map(item => (
            <button 
              key={item.key}
              onClick={() => onPageChange(item.key)}
              className={`w-full flex items-center px-4 py-3 text-left text-gray-700 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className={`font-medium ml-3 transition-opacity duration-300 ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}>
                {item.label}
              </span>
            </button>
          ))}

          <hr className={`my-4 border-gray-200 transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`} />

          {/* Botão Sair */}
          <button 
            className={`w-full flex items-center px-4 py-2 text-left text-red-600 rounded-xl hover:bg-red-50 hover:shadow-md transition-all duration-200 group ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Sair' : ''}
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
            <span className={`font-medium ml-3 transition-opacity duration-300 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              Sair
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
