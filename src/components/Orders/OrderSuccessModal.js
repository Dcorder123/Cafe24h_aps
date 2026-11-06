import React from 'react';
import { PAGES } from '../../utils/constants';

const OrderSuccessModal = ({ isOpen, onClose, orderData, onNavigate, darkMode = false }) => {
  if (!isOpen || !orderData) return null;

  const formatPrice = (price) => {
    return `R$ ${Number(price || 0).toFixed(2).replace('.', ',')}`;
  };

  const orderNumber = orderData.orderId || Math.floor(1000 + Math.random() * 9000);

  const getDeliveryLabel = (type) => {
    switch (type) {
      case 'delivery': return '🚚 Entrega em Domicílio';
      case 'pickup': return '🏃 Retirada no Balcão';
      default: return '🍽️ Comer no Local';
    }
  };

  const getPaymentLabel = (method) => {
    switch (method) {
      case 'pix': return '📱 PIX Instantâneo';
      case 'card': return '💳 Cartão';
      case 'cash': return '💵 Dinheiro';
      default: return method;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className={`rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-all transform scale-100 ${
        darkMode ? 'bg-gray-900 text-gray-100 border border-gray-700' : 'bg-white text-gray-800'
      }`}>
        {/* Header Festivo */}
        <div className={`p-6 text-center border-b ${
          darkMode ? 'border-gray-800 bg-gray-950' : 'border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50'
        }`}>
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-3 shadow-lg">
            ✓
          </div>
          <h2 className="text-2xl font-bold">
            Pedido Confirmado! 🎉
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Seu pedido <span className="font-semibold text-amber-500">#{orderNumber}</span> já está sendo preparado.
          </p>
        </div>

        {/* Corpo do Resumo */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status e Estimativa */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border text-center ${
              darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className="text-xs text-gray-400 block mb-0.5">Tempo Estimado</span>
              <span className="font-bold text-sm text-green-500">⏱️ ~{orderData.estimatedTime || 25} min</span>
            </div>
            <div className={`p-3 rounded-xl border text-center ${
              darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className="text-xs text-gray-400 block mb-0.5">Status</span>
              <span className="font-bold text-sm text-amber-500">🍳 Em Preparo</span>
            </div>
          </div>

          {/* Dados de Entrega e Pagamento */}
          <div className={`p-3.5 rounded-xl border space-y-2 text-xs sm:text-sm ${
            darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Modalidade:</span>
              <span className="font-medium">{getDeliveryLabel(orderData.delivery)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Pagamento:</span>
              <span className="font-medium">{getPaymentLabel(orderData.method)}</span>
            </div>
            {orderData.customerName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Cliente:</span>
                <span className="font-medium">{orderData.customerName}</span>
              </div>
            )}
            {orderData.address && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Endereço:</span>
                <span className="font-medium truncate max-w-[200px]">{orderData.address}</span>
              </div>
            )}
          </div>

          {/* Lista de Itens */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
              Itens do Pedido ({orderData.items ? orderData.items.length : 0})
            </h4>
            <div className={`rounded-xl border divide-y ${
              darkMode ? 'bg-gray-950 border-gray-800 divide-gray-800' : 'bg-white border-gray-200 divide-gray-100'
            }`}>
              {orderData.items && orderData.items.map((item, index) => (
                <div key={index} className="p-2.5 flex justify-between items-center text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-amber-500 mr-2">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-bold">Total Pago:</span>
            <span className="text-xl font-bold text-amber-500">
              {formatPrice(orderData.total)}
            </span>
          </div>
        </div>

        {/* Footer com Ações */}
        <div className={`p-4 sm:p-6 border-t flex flex-col sm:flex-row gap-3 ${
          darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={() => {
              onClose();
              if (onNavigate) onNavigate(PAGES.HISTORY);
            }}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md text-center"
          >
            📋 Acompanhar em Pedidos
          </button>
          <button
            onClick={onClose}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-medium transition-colors text-center ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            ☕ Novo Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;

