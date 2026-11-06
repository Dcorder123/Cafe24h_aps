import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import './App.css';

// Componentes modulares
import Sidebar from './components/Layout/Sidebar';
import MenuPage from './pages/MenuPage';
import AccountPage from './pages/AccountPage';
import ReservationPage from './pages/ReservationPage';
import OrderHistory from './components/Orders/OrderHistory';
import CartModal from './components/Cart/CartModal';
import AdminModal from './components/Admin/AdminModal';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPage from './pages/PrivacyPage';
import AdminPage from './pages/AdminPage';
import Footer from './components/Layout/Footer';
import CookieBanner from './components/ui/CookieBanner';
import OrderSuccessModal from './components/Orders/OrderSuccessModal';

// Hooks, serviços e utils
import { useCart } from './hooks/useCart';
import { ProductService } from './services/ProductService';
import { CATEGORIES, PAGES, FIREBASE_CONFIG } from './utils/constants';

// Inicializar Firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(PAGES.MENU);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Modo Escuro
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('cafe24h_dark') === 'true';
    } catch {
      return false;
    }
  });

  // Modo Administrador
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem('cafe24h_admin') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const { itemCount } = useCart();

  // Sincronizar classe dark no elemento raiz HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('cafe24h_dark', next ? 'true' : 'false');
      } catch {}
      return next;
    });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    try {
      sessionStorage.setItem('cafe24h_admin', 'true');
    } catch {}
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem('cafe24h_admin');
    } catch {}
    setIsAdminModalOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    ProductService.getInstance().deleteProduct(productId);
  };

  // Verificar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Autenticação Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setLoading(false);
      } else {
        signInAnonymously(auth)
          .then(() => setLoading(false))
          .catch((error) => {
            console.error("Erro na autenticação:", error);
            setLoading(false);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(PAGES.MENU);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleCheckout = (items, total, paymentData) => {
    setOrderSuccessData({
      items,
      total,
      ...paymentData
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gradient-to-br from-amber-50 to-orange-100 text-gray-800'
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Carregando Caffe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gradient-to-br from-amber-50 to-orange-100 text-gray-800'
    }`}>
      <div className="flex relative">
        {/* Overlay para mobile */}
        {isMobile && !sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Sidebar - Fixa */}
        <div className={`fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ${
          isMobile && sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}>
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            isCollapsed={!isMobile && sidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            darkMode={darkMode}
            className="h-full"
            currentPage={currentPage}
            onNavigate={handlePageChange}
            isAdmin={isAdmin}
            onOpenAdmin={() => {
              if (isMobile) setSidebarCollapsed(true);
              handlePageChange(PAGES.ADMIN);
            }}
          />
        </div>

        {/* Main Content */}
        <div className={`flex-1 min-h-screen flex flex-col layout-transition ${
          isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          {/* Header Superior Responsivo */}
          <header className={`sticky top-0 z-30 header-blur shadow-sm p-3 sm:p-4 layout-transition ${
            darkMode ? 'bg-gray-900/95 border-b border-gray-800 text-white' : 'bg-white/95 border-b border-amber-100'
          }`}>
            <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
              
              {/* Lado Esquerdo: Mobile Menu + Barra de Busca Responsiva */}
              <div className="flex items-center gap-2 flex-1 max-w-2xl">
                {isMobile && (
                  <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                    aria-label="Abrir Menu"
                  >
                    <span className="text-2xl">☰</span>
                  </button>
                )}

                {/* Barra de busca flexível */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="🔍 Buscar produtos, cafés, salgados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full py-2 sm:py-2.5 pl-3 sm:pl-4 pr-8 sm:pr-9 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-amber-500 outline-none shadow-sm transition-all ${
                      darkMode 
                        ? 'bg-gray-800/90 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-gray-50/90 border-gray-200 text-gray-800 placeholder-gray-400'
                    }`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Lado Direito: Navegação (Desktop), Admin, Modo Escuro e Carrinho */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                
                {/* Links de navegação principais - Apenas Desktop (no mobile fica na sidebar) */}
                <nav className="hidden md:flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(PAGES.MENU)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                      currentPage === PAGES.MENU
                        ? 'bg-amber-600 text-white shadow-sm'
                        : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    title="Ver Cardápio"
                  >
                    <span>☕</span>
                    <span>Cardápio</span>
                  </button>

                  <button
                    onClick={() => handlePageChange(PAGES.HISTORY)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                      currentPage === PAGES.HISTORY
                        ? 'bg-amber-600 text-white shadow-sm'
                        : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    title="Meus Pedidos"
                  >
                    <span>📋</span>
                    <span>Pedidos</span>
                  </button>

                  <button
                    onClick={() => handlePageChange(PAGES.RESERVATION)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                      currentPage === PAGES.RESERVATION
                        ? 'bg-amber-600 text-white shadow-sm'
                        : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    title="Reservar Mesa"
                  >
                    <span>🗓️</span>
                    <span>Reservas</span>
                  </button>

                  <button
                    onClick={() => handlePageChange(PAGES.ACCOUNT)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                      currentPage === PAGES.ACCOUNT
                        ? 'bg-amber-600 text-white shadow-sm'
                        : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    title="Minha Conta"
                  >
                    <span>👤</span>
                    <span>Conta</span>
                  </button>
                </nav>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block" />

                {/* Botão Admin - Apenas Desktop (no mobile fica na sidebar) */}
                <button
                  onClick={() => handlePageChange(PAGES.ADMIN)}
                  className={`hidden md:flex p-2 sm:px-3 sm:py-2 rounded-xl text-sm font-medium transition-all items-center gap-1.5 ${
                    currentPage === PAGES.ADMIN
                      ? 'bg-amber-600 text-white shadow-sm'
                      : isAdmin
                      ? 'bg-red-500/10 text-red-600 border border-red-500/30'
                      : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title={isAdmin ? "Painel Admin (Ativo)" : "Acesso de Administrador"}
                >
                  <span className="text-lg">🛡️</span>
                  <span>{isAdmin ? 'Painel Admin' : 'Admin'}</span>
                </button>

                {/* Botão Modo Escuro */}
                <button
                  onClick={handleToggleDarkMode}
                  className={`p-2 sm:p-2.5 rounded-xl text-lg transition-colors duration-200 ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title={darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                  aria-label="Alternar tema escuro/claro"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>

                {/* Botão do Carrinho */}
                <button
                  onClick={handleCartOpen}
                  className="relative p-2 sm:px-4 sm:py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-all duration-200 flex items-center gap-2"
                  title="Abrir Carrinho"
                >
                  <span className="text-xl">🛒</span>
                  {itemCount > 0 && (
                    <>
                      <span className="hidden xl:inline font-medium text-sm">
                        {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                      </span>
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                        {itemCount}
                      </span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </header>

          {/* Conteúdo das páginas */}
          <main className="flex-1 p-4 sm:p-8 smooth-scroll">
            {currentPage === PAGES.MENU && (
              <MenuPage 
                selectedCategory={selectedCategory}
                searchTerm={searchTerm}
                onOpenCart={handleCartOpen}
                isAdmin={isAdmin}
                onDeleteProduct={handleDeleteProduct}
                onOpenAddProduct={() => handlePageChange(PAGES.ADMIN)}
                darkMode={darkMode}
              />
            )}

            {currentPage === PAGES.ACCOUNT && (
              <AccountPage 
                darkMode={darkMode}
                onToggleDarkMode={handleToggleDarkMode}
                onNavigate={handlePageChange}
              />
            )}

            {currentPage === PAGES.RESERVATION && (
              <ReservationPage darkMode={darkMode} />
            )}

            {currentPage === PAGES.HISTORY && (
              <OrderHistory darkMode={darkMode} />
            )}

            {currentPage === PAGES.PRIVACY && (
              <PrivacyPage 
                darkMode={darkMode}
                onNavigate={handlePageChange}
              />
            )}

            {currentPage === PAGES.ADMIN && (
              <AdminPage
                isAdmin={isAdmin}
                onLoginSuccess={handleAdminLoginSuccess}
                onLogout={handleAdminLogout}
                onNavigate={handlePageChange}
                darkMode={darkMode}
              />
            )}

            {/* Página 404 para rotas inexistentes */}
            {![PAGES.MENU, PAGES.ACCOUNT, PAGES.RESERVATION, PAGES.HISTORY, PAGES.PRIVACY, PAGES.ADMIN].includes(currentPage) && (
              <NotFoundPage 
                onNavigate={handlePageChange}
                darkMode={darkMode}
              />
            )}
          </main>

          {/* Rodapé Institucional */}
          <Footer onNavigate={handlePageChange} darkMode={darkMode} />
        </div>

        {/* Cookie Banner LGPD */}
        <CookieBanner onNavigate={handlePageChange} darkMode={darkMode} />

        {/* Cart Modal */}
        <CartModal 
          isOpen={isCartOpen}
          onClose={handleCartClose}
          onCheckout={handleCheckout}
          darkMode={darkMode}
        />

        {/* Admin Modal */}
        <AdminModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          isAdmin={isAdmin}
          onLoginSuccess={handleAdminLoginSuccess}
          onLogout={handleAdminLogout}
          darkMode={darkMode}
        />

        {/* Modal de Pedido Confirmado */}
        <OrderSuccessModal
          isOpen={!!orderSuccessData}
          onClose={() => setOrderSuccessData(null)}
          orderData={orderSuccessData}
          onNavigate={handlePageChange}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

export default App;
