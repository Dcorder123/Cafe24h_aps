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

// Hooks e utils
import { useCart } from './hooks/useCart';
import { CATEGORIES, PAGES, FIREBASE_CONFIG } from './utils/constants';

// Inicializar Firebase
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(PAGES.MENU);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { itemCount, total } = useCart();

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        signInAnonymously(auth)
          .then((result) => {
            setUser(result.user);
            setLoading(false);
          })
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
    console.log('Checkout realizado:', { items, total, paymentData });
    
    // Criar mensagem detalhada do pedido
    const orderSummary = `
🎉 Pedido Confirmado! 

📋 Resumo:
${items.map(item => `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}

💰 Total: R$ ${total.toFixed(2)}
💳 Pagamento: ${paymentData.method === 'pix' ? 'PIX' : paymentData.method === 'card' ? 'Cartão' : 'Dinheiro'}
🚚 Entrega: ${paymentData.delivery === 'local' ? 'Comer no Local' : paymentData.delivery === 'delivery' ? 'Entrega' : 'Retirada'}

Obrigado por escolher o Caffe! 
Seu pedido será preparado em breve.
    `;
    
    alert(orderSummary);
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Carregando Caffe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="flex relative">
        {/* Overlay para mobile */}
        {isMobile && !sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Sidebar - Sempre fixa */}
        <div className={`fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ${
          isMobile && sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}>
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onPageChange={handlePageChange}
            isCollapsed={!isMobile && sidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            className="h-full"
          />
        </div>

        {/* Main Content */}
        <div className={`flex-1 min-h-screen layout-transition ${
          isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          {/* Header com busca e carrinho - Sempre fixo */}
          <div className="fixed top-0 right-0 header-blur shadow-md z-30 p-4 layout-transition" 
               style={{
                 left: isMobile ? '0' : sidebarCollapsed ? '4rem' : '16rem'
               }}>
            <div className="flex items-center gap-4">
              {/* Botão do menu mobile */}
              {isMobile && (
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-xl">☰</span>
                </button>
              )}

              {/* Barra de busca */}
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm"
                />
              </div>

              {/* Botão do carrinho */}
              <button
                onClick={handleCartOpen}
                className="relative p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <span className="text-xl">🛒</span>
                {itemCount > 0 && (
                  <>
                    <span className="hidden sm:inline font-medium">
                      {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                    </span>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Conteúdo das páginas com padding-top para compensar o header fixo */}
          <div className="pt-20 p-8 smooth-scroll">
            {currentPage === PAGES.MENU && (
              <MenuPage 
                selectedCategory={selectedCategory}
                searchTerm={searchTerm}
              />
            )}

            {currentPage === PAGES.ACCOUNT && <AccountPage />}

            {currentPage === PAGES.RESERVATION && <ReservationPage />}

            {currentPage === PAGES.HISTORY && <OrderHistory />}

            {/* Páginas em desenvolvimento */}
            {currentPage === PAGES.CART && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {getPageTitle(currentPage)}
                </h2>
                <p className="text-gray-600">Esta funcionalidade estará disponível em breve!</p>
                <button
                  onClick={() => setCurrentPage(PAGES.MENU)}
                  className="mt-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  🍽️ Ver Cardápio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cart Modal */}
        <CartModal 
          isOpen={isCartOpen}
          onClose={handleCartClose}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}

// Função auxiliar para obter título da página
const getPageTitle = (page) => {
  const titles = {
    [PAGES.HISTORY]: 'Histórico de Pedidos',
    [PAGES.RESERVATION]: 'Reservas',
    [PAGES.CART]: 'Carrinho'
  };
  return titles[page] || 'Página';
};

export default App;
