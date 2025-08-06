import React, { useState } from 'react';
import ProductList from '../components/Product/ProductList';
import CartModal from '../components/Cart/CartModal';
import { useCart } from '../hooks/useCart';
import { CATEGORIES } from '../utils/constants';

const MenuPage = ({ selectedCategory, searchTerm }) => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { addItem, itemCount, total } = useCart();

  const handleAddToCart = (product) => {
    addItem(product);
    // Feedback visual opcional
    console.log(`Produto ${product.name} adicionado ao carrinho!`);
  };

  const handleCheckout = (items, totalAmount) => {
    console.log('Finalizando pedido:', { items, total: totalAmount });
    // Aqui seria implementada a lógica de checkout
    // Por exemplo, redirecionamento para página de pagamento
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="relative">
      {/* Header da página */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-2xl shadow-md mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedCategory === CATEGORIES.ALL ? '🍽️ Cardápio Completo' : getCategoryTitle(selectedCategory)}
            </h1>
            <p className="text-gray-600">
              Escolha seus itens favoritos e monte seu pedido perfeito
            </p>
          </div>

          {/* Botão do carrinho flutuante */}
          {itemCount > 0 && (
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-lg">🛒</span>
              <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
              <span className="ml-2 font-bold">{formatPrice(total)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Lista de produtos */}
      <ProductList
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onAddToCart={handleAddToCart}
      />

      {/* Modal do carrinho */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Botão carrinho fixo (mobile) */}
      {itemCount > 0 && (
        <button
          onClick={() => setIsCartModalOpen(true)}
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
