import React from 'react';
import { PAGES } from '../../utils/constants';

const Footer = ({ onNavigate, darkMode = false }) => {
  return (
    <footer className={`mt-16 border-t transition-colors ${
      darkMode 
        ? 'bg-gray-950 border-gray-800 text-gray-400' 
        : 'bg-white border-amber-100 text-gray-600'
    }`}>
      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Coluna 1: Marca & Apresentação */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                ☕
              </div>
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-amber-500">C</span>affe 24h
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              O autêntico café artesanal e confeitaria gourmet preparado com carinho 24 horas por dia. Sistema desenvolvido para demonstração profissional e portfólio.
            </p>
          </div>

          {/* Coluna 2: Atendimento e Localização */}
          <div className="space-y-2 text-xs sm:text-sm">
            <h4 className={`font-bold uppercase tracking-wider text-xs mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Atendimento
            </h4>
            <p className="flex items-center gap-2">
              <span>📍</span> Rua do Café, 123 - Centro
            </p>
            <p className="flex items-center gap-2">
              <span>📞</span> (11) 99999-9999
            </p>
            <p className="flex items-center gap-2">
              <span>✉️</span> contato@cafe24h.com
            </p>
            <p className="flex items-center gap-2">
              <span>⏰</span> Funcionamento: 24 Horas
            </p>
          </div>

          {/* Coluna 3: Navegação Rápida */}
          <div className="space-y-2 text-xs sm:text-sm">
            <h4 className={`font-bold uppercase tracking-wider text-xs mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Navegação
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PAGES.MENU)}
                  className="hover:text-amber-500 transition-colors"
                >
                  Cardápio Completo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PAGES.HISTORY)}
                  className="hover:text-amber-500 transition-colors"
                >
                  Meus Pedidos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PAGES.RESERVATION)}
                  className="hover:text-amber-500 transition-colors"
                >
                  Reservar Mesa
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PAGES.ACCOUNT)}
                  className="hover:text-amber-500 transition-colors"
                >
                  Minha Conta & Preferências
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Institucional & Legal */}
          <div className="space-y-2 text-xs sm:text-sm">
            <h4 className={`font-bold uppercase tracking-wider text-xs mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Institucional
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
                  className="hover:text-amber-500 transition-colors"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
                  className="hover:text-amber-500 transition-colors"
                >
                  Aviso de Privacidade (LGPD)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
                  className="hover:text-amber-500 transition-colors"
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
                  className="hover:text-amber-500 transition-colors"
                >
                  Política de Cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className={`mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${
          darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'
        }`}>
          <div>
            © {new Date().getFullYear()} Caffe 24h. Todos os direitos reservados. Projeto Portfólio.
          </div>

          {/* Links em formato de texto conforme especificado */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <button 
              onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline"
            >
              Sobre Nós
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline"
            >
              Aviso de Privacidade
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline"
            >
              Política de Cookies
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline"
            >
              Termos de Uso
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

