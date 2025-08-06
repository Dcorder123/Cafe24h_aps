import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import apiService from '../../services/ApiService';

const PaymentModal = ({ isOpen, onClose, onPaymentComplete, orderData }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [pixCode, setPixCode] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'pix', name: 'PIX', icon: '📱', description: 'Pagamento instantâneo' },
    { id: 'card', name: 'Cartão', icon: '💳', description: 'Débito ou Crédito' },
    { id: 'cash', name: 'Dinheiro', icon: '💵', description: 'Pagamento em espécie' }
  ];

  const deliveryOptions = [
    { id: 'local', name: 'Comer no Local', icon: '🍽️', description: 'Mesa no restaurante' },
    { id: 'delivery', name: 'Entrega', icon: '🚚', description: 'Entrega em domicílio' },
    { id: 'pickup', name: 'Retirada', icon: '🏃', description: 'Retirar no balcão' }
  ];

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const generatePixCode = () => {
    const code = Math.random().toString(36).substr(2, 9).toUpperCase();
    setPixCode(`PIX-${code}`);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !deliveryOption) {
      alert('Selecione a modalidade de pagamento e o tipo de entrega');
      return;
    }

    setProcessing(true);

    try {
      // Usar usuário de teste se não estiver autenticado
      let currentUser = null;
      try {
        const auth = getAuth();
        currentUser = auth.currentUser;
      } catch (error) {
        console.log('Firebase não configurado, usando usuário de teste');
      }

      // Preparar dados do pedido para a API
      const orderPayload = {
        usuario_id: 1, // ID do usuário de teste
        total: orderData.total,
        tipo_entrega: deliveryOption,
        metodo_pagamento: selectedPaymentMethod,
        endereco_entrega: deliveryOption === 'delivery' ? 'Endereço de teste' : null,
        observacoes: 'Pedido de teste',
        items: orderData.items.map(item => ({
          produto_id: item.id || 1, // ID padrão se não tiver
          quantidade: item.quantity,
          preco_unitario: item.price,
          subtotal: item.price * item.quantity
        })),
        codigo_transacao: selectedPaymentMethod === 'pix' ? pixCode : null,
        dados_pagamento: {
          method: selectedPaymentMethod,
          delivery: deliveryOption,
          cardData: selectedPaymentMethod === 'card' ? cardData : null,
          cashAmount: selectedPaymentMethod === 'cash' ? cashAmount : null
        }
      };

      // Se há usuário autenticado, tentar usar seus dados
      if (currentUser) {
        try {
          const existingUser = await apiService.getUserByUid(currentUser.uid);
          orderPayload.usuario_id = existingUser.id;
        } catch (error) {
          // Usuário não existe, criar novo
          const newUser = await apiService.createUser({
            uid: currentUser.uid,
            nome: currentUser.displayName || 'Usuário do Caffe',
            email: currentUser.email || 'usuario@caffe.com',
            telefone: '(11) 99999-9999',
            endereco: ''
          });
          orderPayload.usuario_id = newUser.id;
        }
      }

      // Criar pedido na API
      const orderResult = await apiService.createOrder(orderPayload);

      const paymentData = {
        method: selectedPaymentMethod,
        delivery: deliveryOption,
        total: orderData.total,
        items: orderData.items,
        orderId: orderResult.id,
        estimatedTime: orderResult.estimatedTime || 30,
        timestamp: new Date().toISOString()
      };

      onPaymentComplete(paymentData);
      setProcessing(false);
      onClose();

    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      alert(`Erro ao processar pedido: ${error.message}`);
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            💳 <span className="ml-2">Finalizar Pedido</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
          >
            <span className="text-xl">❌</span>
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Resumo do Pedido */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Resumo do Pedido</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{item.quantity}x {item.name}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span className="text-amber-600">{formatPrice(orderData.total)}</span>
              </div>
            </div>

            {/* Opções de Entrega */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">🚚 Tipo de Entrega</h4>
              {deliveryOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDeliveryOption(option.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    deliveryOption === option.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="font-medium">{option.name}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Modalidades de Pagamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💳 Modalidade de Pagamento</h3>
            
            {/* Seleção de Método */}
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedPaymentMethod === method.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Formulários específicos por método */}
            {selectedPaymentMethod === 'pix' && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-gray-800">Pagamento via PIX</h4>
                <button
                  onClick={generatePixCode}
                  className="w-full bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  📱 Gerar Código PIX
                </button>
                {pixCode && (
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <p className="text-sm text-gray-600 mb-2">Código PIX:</p>
                    <p className="font-mono text-lg font-bold">{pixCode}</p>
                    <p className="text-xs text-gray-500 mt-2">Use este código no seu app de pagamento</p>
                  </div>
                )}
              </div>
            )}

            {selectedPaymentMethod === 'card' && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-gray-800">Dados do Cartão</h4>
                <input
                  type="text"
                  placeholder="Número do cartão"
                  value={cardData.number}
                  onChange={(e) => setCardData({...cardData, number: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Nome no cartão"
                  value={cardData.name}
                  onChange={(e) => setCardData({...cardData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                    className="p-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                    className="p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'cash' && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-gray-800">Pagamento em Dinheiro</h4>
                <input
                  type="number"
                  placeholder="Valor para troco (opcional)"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <p className="text-sm text-gray-600">
                  Total: <span className="font-bold">{formatPrice(orderData.total)}</span>
                </p>
                {cashAmount && parseFloat(cashAmount) > orderData.total && (
                  <p className="text-sm text-green-600">
                    Troco: <span className="font-bold">
                      {formatPrice(parseFloat(cashAmount) - orderData.total)}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer com botões */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white p-4 rounded-xl font-medium hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || !deliveryOption || processing}
              className="flex-1 bg-amber-600 text-white p-4 rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processando...
                </div>
              ) : (
                `💳 Finalizar Pagamento - ${formatPrice(orderData.total)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
