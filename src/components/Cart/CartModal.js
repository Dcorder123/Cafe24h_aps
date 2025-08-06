import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import PaymentModal from '../Payment/PaymentModal';

const CartModal = ({ isOpen, onClose, onCheckout }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { 
    items, 
    total, 
    // addItem, // Removido - não usado
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            🛒 <span className="ml-2">Meu Carrinho</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
          >
            <span className="text-xl">❌</span>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col max-h-[calc(90vh-180px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-2">Carrinho vazio</h3>
              <p className="text-center">Adicione alguns itens deliciosos ao seu carrinho!</p>
            </div>
          ) : (
            <>
              {/* Lista de itens */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                    {/* Imagem do produto */}
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <span className="text-2xl hidden">{item.icon || '🍽️'}</span>
                    </div>

                    {/* Informações do item */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600 truncate">{item.description}</p>
                      <p className="text-lg font-bold text-amber-600">{formatPrice(item.price)}</p>
                    </div>

                    {/* Controles de quantidade */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 flex items-center justify-center font-bold"
                      >
                        −
                      </button>
                      
                      <span className="w-12 text-center font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-bold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Botão remover */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 flex-shrink-0"
                      title="Remover item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Resumo e ações */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Resumo do pedido */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Taxa de entrega</span>
                    <span className="font-semibold text-green-600">Grátis</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-amber-600">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    🗑️ Limpar Carrinho
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    className="flex-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    🚀 Finalizar Pedido
                  </button>
                </div>

                {/* Informações adicionais */}
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>🚚 Entrega grátis para pedidos</p>
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
      />
    </div>
  );
};

export default CartModal;
