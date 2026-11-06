import React from 'react';
import { PAGES } from '../utils/constants';

const NotFoundPage = ({ onNavigate, darkMode = false }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className={`max-w-md w-full text-center p-8 rounded-3xl shadow-xl transition-all ${
        darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-white text-gray-800'
      }`}>
        <div className="relative mb-6">
          <span className="text-8xl select-none">☕</span>
          <span className="absolute -bottom-2 right-1/4 text-3xl animate-bounce">❓</span>
        </div>

        <h1 className="text-6xl font-extrabold text-amber-500 mb-2 font-mono">404</h1>
        <h2 className="text-2xl font-bold mb-3">Xícara Vazia!</h2>
        
        <p className={`text-sm mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          A página ou pedido que você está procurando não existe, foi servido em outra mesa ou mudou de endereço.
        </p>

        <button
          onClick={() => onNavigate && onNavigate(PAGES.MENU)}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <span>🍽️</span> Voltar ao Cardápio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;

