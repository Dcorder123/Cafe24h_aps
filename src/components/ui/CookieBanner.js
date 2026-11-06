import React, { useState, useEffect } from 'react';
import { PAGES } from '../../utils/constants';

const CookieBanner = ({ onNavigate, darkMode = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cafe24h_cookie_consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cafe24h_cookie_consent', 'accepted');
    } catch {}
    setIsVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem('cafe24h_cookie_consent', 'rejected');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 border-t shadow-2xl backdrop-blur-md transition-all animate-slideUp ${
      darkMode 
        ? 'bg-gray-900/95 border-gray-800 text-gray-200' 
        : 'bg-white/95 border-amber-200 text-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex-1">
          <p>
            Nós utilizamos cookies e armazenamento local para oferecer uma experiência personalizada e salvar seus pedidos. Consulte também nosso{' '}
            <button
              onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
              className="text-amber-600 dark:text-amber-400 font-semibold underline hover:opacity-80 transition-opacity"
            >
              Aviso de Privacidade
            </button>
            {' '}e nossos{' '}
            <button
              onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
              className="text-amber-600 dark:text-amber-400 font-semibold underline hover:opacity-80 transition-opacity"
            >
              Termos de Uso
            </button>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={handleReject}
            className={`px-4 py-2 rounded-xl font-medium border text-xs transition-colors ${
              darkMode 
                ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Rejeitar
          </button>
          
          <button
            onClick={handleAccept}
            className="px-5 py-2 rounded-xl font-medium bg-amber-600 hover:bg-amber-700 text-white text-xs shadow-md transition-all"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

