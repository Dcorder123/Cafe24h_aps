import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import PaymentModal from '../Payment/PaymentModal';

const CartModal = ({ isOpen, onClose, onCheckout, darkMode = false }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { 
    items, 
    total, 
    removeItem, 
    updateQuantity, 
    clearCart 
  } = useCart();

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Carrinho vazio!');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = (paymentData) => {
    if (onCheckout) {
      onCheckout(items, total, paymentData);
    }
    clearCart();
    setIsPaymentModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden ${
        darkMode ? 'bg-gray-900 text-gray-100 border border-gray-700' : 'bg-white text-gray-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-800 bg-gray-950 text-white' : 'border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 text-gray-800'
        }`}>
          <h2 className="text-2xl font-bold flex items-center">
            🛒 <span className="ml-2">Meu Carrinho</span>
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-white text-gray-600'
            }`}
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col max-h-[calc(90vh-180px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Carrinho vazio
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Adicione alguns itens deliciosos ao seu carrinho!
              </p>
            </div>
          ) : (
            <>
              {/* Lista de itens */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    className={`rounded-xl p-4 flex items-center gap-4 border transition-colors ${
                      darkMode 
                        ? 'bg-gray-800/80 border-gray-700 text-gray-100' 
                        : 'bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                  >
                    {/* Imagem do produto */}
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.imageUrl || item.image || '/images/placeholder.svg'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/placeholder.svg';
                        }}
                      />
                    </div>

                    {/* Informações do item */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {item.name}
                      </h4>
                      <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                      <p className="text-lg font-bold text-amber-500">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Controles de quantidade */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-colors ${
                          darkMode 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        −
                      </button>
                      
                      <span className={`w-8 sm:w-10 text-center font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-colors ${
                          darkMode 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right flex-shrink-0 ml-2 sm:ml-4">
                      <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Botão remover */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        darkMode 
                          ? 'text-red-400 hover:bg-red-500/20' 
                          : 'text-red-500 hover:bg-red-50'
                      }`}
                      title="Remover item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Resumo e ações */}
              <div className={`border-t p-6 ${
                darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'
              }`}>
                {/* Resumo do pedido */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Taxa de entrega
                    </span>
                    <span className="font-semibold text-green-500">Grátis</span>
                  </div>
                  <hr className={`my-2 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`} />
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Total
                    </span>
                    <span className="text-2xl font-bold text-amber-500">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${
                      darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    🗑️ Limpar
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    className="flex-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg text-sm"
                  >
                    🚀 Finalizar Pedido
                  </button>
                </div>

                {/* Informações adicionais */}
                <div className={`mt-4 text-center text-xs space-y-1 ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  <p>🚚 Entrega expressa para pedidos locais</p>
                  <p>⏱️ Tempo estimado: 20-30 minutos</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={handlePaymentComplete}
        orderData={{ items, total }}
        darkMode={darkMode}
      />
    </div>
  );
};

export default CartModal;
