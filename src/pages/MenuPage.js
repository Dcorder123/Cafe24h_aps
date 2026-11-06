import React from 'react';
import ProductList from '../components/Product/ProductList';
import { useCart } from '../hooks/useCart';
import { CATEGORIES } from '../utils/constants';

const MenuPage = ({ selectedCategory, searchTerm, onOpenCart, isAdmin = false, onDeleteProduct, onOpenAddProduct, darkMode = false }) => {
  const { addItem, itemCount, total } = useCart();

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="relative">
      {/* Banner de Admin se estiver ativo */}
      {isAdmin && (
        <div className="mb-6 p-4 bg-amber-500/10 border-2 border-dashed border-amber-500 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="font-bold text-amber-600 dark:text-amber-400">Modo Administrador Ativo</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">Você pode adicionar itens ao cardápio ou remover produtos diretamente nos cards.</p>
            </div>
          </div>
          <button
            onClick={onOpenAddProduct}
            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-all flex items-center gap-2"
          >
            <span>➕</span> Adicionar Produto
          </button>
        </div>
      )}

      {/* Header da página */}
      <div className={`p-6 rounded-2xl shadow-md mb-8 ${
        darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-gradient-to-r from-amber-50 to-amber-100'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {selectedCategory === CATEGORIES.ALL ? '🍽️ Cardápio Completo' : getCategoryTitle(selectedCategory)}
            </h1>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Escolha seus itens favoritos e monte seu pedido perfeito
            </p>
          </div>
        </div>
      </div>

      {/* Lista de produtos */}
      <ProductList
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onAddToCart={handleAddToCart}
        isAdmin={isAdmin}
        onDeleteProduct={onDeleteProduct}
        darkMode={darkMode}
      />

      {/* Botão carrinho fixo (mobile) */}
      {itemCount > 0 && onOpenCart && (
        <button
          onClick={onOpenCart}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-40 sm:hidden"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{itemCount}</span>
              <span className="text-xs">{formatPrice(total)}</span>
            </div>
          </div>
        </button>
      )}

      {/* Feedback de carrinho vazio */}
      {itemCount === 0 && searchTerm === '' && (
        <div className="mt-12 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              Carrinho vazio
            </h3>
            <p className="text-amber-600 text-sm">
              Explore nosso delicioso cardápio e adicione seus itens favoritos!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para obter título da categoria
const getCategoryTitle = (category) => {
  const titles = {
    [CATEGORIES.COFFEE]: '☕ Cafés Especiais',
    [CATEGORIES.TEA]: '🍵 Chás Selecionados',
    [CATEGORIES.SNACKS]: '🥐 Salgados Frescos',
    [CATEGORIES.SWEETS]: '🧁 Doces Irresistíveis',
    [CATEGORIES.DRINKS]: '🥤 Bebidas Refrescantes'
  };
  return titles[category] || '🍽️ Cardápio';
};

export default MenuPage;
