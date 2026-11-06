import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import apiService from '../../services/ApiService';
import { formatPhone, onlyNumbers, onlyDecimals } from '../../utils/formatters';
import { CustomerService } from '../../services/CustomerService';

const PaymentModal = ({ isOpen, onClose, onPaymentComplete, orderData, darkMode = false }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');
  
  // Dados do cliente para identificação e entrega
  const [customer, setCustomer] = useState(() => CustomerService.getCurrentUser());
  const [autoLoadedMsg, setAutoLoadedMsg] = useState('');

  // Sincronizar dados do cliente quando a modal abre
  useEffect(() => {
    if (isOpen) {
      setCustomer(CustomerService.getCurrentUser());
      setAutoLoadedMsg('');
    }
  }, [isOpen]);

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

  // Manipular digitação do telefone com máscara e busca automática
  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setCustomer(prev => ({ ...prev, phone: formatted }));

    const digits = formatted.replace(/\D/g, '');
    if (digits.length >= 10) {
      const existing = CustomerService.findByPhone(digits);
      if (existing) {
        setCustomer(prev => ({
          ...prev,
          name: existing.name || prev.name,
          email: existing.email || prev.email,
          address: existing.address || prev.address,
          number: existing.number || prev.number,
          phone: formatted
        }));
        setAutoLoadedMsg(`✨ Dados de ${existing.name || 'cliente'} preenchidos automaticamente!`);
        setTimeout(() => setAutoLoadedMsg(''), 4000);
      }
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !deliveryOption) {
      alert('Selecione a modalidade de pagamento e o tipo de entrega');
      return;
    }

    // Validação de dados do cliente obrigatórios
    if (!customer.name || !customer.name.trim()) {
      alert('Por favor, preencha o campo Nome Completo *');
      return;
    }

    const phoneDigits = (customer.phone || '').replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      alert('Por favor, informe um Telefone Celular válido com DDD *');
      return;
    }

    if (deliveryOption === 'delivery') {
      if (!customer.address || !customer.address.trim()) {
        alert('Para entrega (delivery), o Endereço (Rua/Avenida) * é obrigatório.');
        return;
      }
      if (!customer.number || !String(customer.number).trim()) {
        alert('Para entrega (delivery), o Número do endereço * é obrigatório.');
        return;
      }
    }

    setProcessing(true);

    try {
      // Salva os dados do cliente para reutilização automática em futuras sessões
      CustomerService.saveUser(customer);

      // Usar usuário de teste se não estiver autenticado
      let currentUser = null;
      try {
        const auth = getAuth();
        currentUser = auth.currentUser;
      } catch (error) {
        console.log('Firebase não configurado, usando usuário de teste');
      }

      // Preparar dados do pedido para a API
      const finalPixCode = selectedPaymentMethod === 'pix' ? (pixCode || `PIX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`) : null;

      const fullAddress = deliveryOption === 'delivery' 
        ? `${customer.address}, ${customer.number}${customer.complement ? ' - ' + customer.complement : ''}`
        : null;

      const orderPayload = {
        usuario_id: 1, // ID do usuário padrão
        total: orderData.total,
        tipo_entrega: deliveryOption,
        metodo_pagamento: selectedPaymentMethod,
        endereco_entrega: fullAddress,
        observacoes: `Cliente: ${customer.name} | Tel: ${customer.phone}`,
        items: orderData.items.map(item => ({
          produto_id: item.id || 1,
          nome: item.name || item.nome || 'Produto',
          quantidade: item.quantity,
          preco_unitario: item.price,
          subtotal: item.price * item.quantity
        })),
        codigo_transacao: finalPixCode,
        dados_pagamento: {
          method: selectedPaymentMethod,
          delivery: deliveryOption,
          cardData: selectedPaymentMethod === 'card' ? {
            brand: 'Simulado',
            last4: cardData.number ? cardData.number.slice(-4) : '0000'
          } : null,
          cashAmount: selectedPaymentMethod === 'cash' ? cashAmount : null
        }
      };

      if (currentUser) {
        try {
          const existingUser = await apiService.getUserByUid(currentUser.uid);
          orderPayload.usuario_id = existingUser.id;
        } catch (error) {
          const newUser = await apiService.createUser({
            uid: currentUser.uid,
            nome: customer.name || currentUser.displayName || 'Usuário do Caffe',
            email: customer.email || currentUser.email || 'usuario@caffe.com',
            telefone: customer.phone || '(11) 99999-9999',
            endereco: fullAddress || ''
          });
          orderPayload.usuario_id = newUser.id;
        }
      }

      // Criar pedido na API com fallback local caso o backend esteja offline
      let orderResult = { id: 'PED-' + Date.now().toString().slice(-6), estimatedTime: 30 };
      try {
        const res = await apiService.createOrder(orderPayload);
        if (res && res.id) orderResult = res;
      } catch (err) {
        console.warn('Backend offline, salvando pedido localmente:', err.message);
      }

      // Persistir no cafe24h_orders para exibição no Painel Admin e Histórico
      try {
        const newOrder = {
          id: orderResult.id,
          data_pedido: new Date().toISOString(),
          total: orderData.total,
          status: 'pendente',
          tipo_entrega: deliveryOption,
          metodo_pagamento: selectedPaymentMethod,
          cliente: customer.name || 'Cliente',
          telefone: customer.phone || '',
          endereco: fullAddress || (deliveryOption === 'delivery' ? 'Endereço informado' : 'No Restaurante / Retirada'),
          items: orderData.items.map(item => ({
            produto_id: item.id || 1,
            nome: item.name || item.nome || 'Produto',
            quantidade: item.quantity,
            preco_unitario: item.price,
            subtotal: item.price * item.quantity
          }))
        };
        const currentOrders = JSON.parse(localStorage.getItem('cafe24h_orders') || '[]');
        localStorage.setItem('cafe24h_orders', JSON.stringify([newOrder, ...currentOrders]));
      } catch {}

      const paymentData = {
        method: selectedPaymentMethod,
        delivery: deliveryOption,
        total: orderData.total,
        items: orderData.items,
        orderId: orderResult.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        address: fullAddress,
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700 bg-gray-900/60 text-white' : 'border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 text-gray-800'
        }`}>
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              💳 <span className="ml-2">Finalizar Pedido</span>
            </h2>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
              Campos marcados com <span className="text-red-500 font-bold">*</span> são obrigatórios
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-white'
            }`}
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Coluna 1: Resumo do Pedido e Identificação do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>📋</span> Resumo do Pedido
            </h3>
            <div className={`rounded-xl p-4 space-y-2 border ${
              darkMode ? 'bg-gray-950/80 border-gray-800 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-800'
            }`}>
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.quantity}x {item.name}</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr className={darkMode ? 'border-gray-800 my-2' : 'border-gray-200 my-2'} />
              <div className="flex justify-between items-center font-bold text-lg">
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total:</span>
                <span className="text-amber-500 font-bold">{formatPrice(orderData.total)}</span>
              </div>
            </div>

            {/* Identificação do Cliente */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              darkMode ? 'bg-gray-900/40 border-gray-700' : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <span>👤</span> Seus Dados
                </h4>
                {autoLoadedMsg && (
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                    {autoLoadedMsg}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Nome Completo <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={customer.name || ''}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                    darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Telefone Celular / WhatsApp <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="(XX) XXXXX-XXXX"
                  value={customer.phone || ''}
                  onChange={handlePhoneChange}
                  className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                    darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <span className="text-[11px] text-gray-500 mt-0.5 block">
                  Ao digitar seu número, seus dados salvos são preenchidos automaticamente.
                </span>
              </div>
            </div>

            {/* Opções de Entrega */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-1.5">
                <span>🚚</span> Tipo de Entrega <span className="text-red-500 font-bold">*</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setDeliveryOption(option.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center flex flex-col items-center justify-center ${
                      deliveryOption === option.id
                        ? darkMode
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-semibold shadow-sm'
                          : 'border-amber-500 bg-amber-50 text-amber-800 font-semibold shadow-sm'
                        : darkMode 
                          ? 'border-gray-800 hover:border-gray-700 bg-gray-950/60 text-gray-300' 
                          : 'border-gray-200 hover:border-amber-300 bg-white text-gray-700'
                    }`}
                  >
                    <span className="text-2xl mb-1">{option.icon}</span>
                    <span className="text-xs font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Se tipo for entrega, solicitar Endereço e Número */}
            {deliveryOption === 'delivery' && (
              <div className={`p-4 rounded-xl border space-y-3 animate-fadeIn ${
                darkMode ? 'bg-gray-900/40 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className="font-semibold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span>📍</span> Endereço para Entrega
                </h4>
                
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Rua / Avenida <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rua das Flores, Bairro Centro"
                    value={customer.address || ''}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                      darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Número <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 123"
                      value={customer.number || ''}
                      onChange={(e) => setCustomer({ ...customer, number: onlyNumbers(e.target.value, 8) })}
                      className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                        darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Complemento (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Apto, Bloco, etc."
                      value={customer.complement || ''}
                      onChange={(e) => setCustomer({ ...customer, complement: e.target.value })}
                      className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                        darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coluna 2: Modalidades de Pagamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>💳</span> Forma de Pagamento <span className="text-red-500 font-bold">*</span>
            </h3>
            
            {/* Seleção de Método */}
            <div className="space-y-2.5">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`w-full p-3.5 rounded-xl border-2 transition-all duration-200 text-left flex items-center justify-between ${
                    selectedPaymentMethod === method.id
                      ? darkMode
                        ? 'border-amber-500 bg-amber-500/20 text-white shadow-sm'
                        : 'border-amber-500 bg-amber-50 text-gray-800 shadow-sm'
                      : darkMode
                        ? 'border-gray-800 hover:border-gray-700 bg-gray-950/60 text-gray-300'
                        : 'border-gray-200 hover:border-amber-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{method.name}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{method.description}</div>
                    </div>
                  </div>
                  {selectedPaymentMethod === method.id && (
                    <span className="text-amber-500 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Formulários específicos por método */}
            {selectedPaymentMethod === 'pix' && (
              <div className={`p-4 rounded-xl border space-y-3 ${
                darkMode ? 'bg-gray-950/60 border-gray-800 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}>
                <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pagamento instantâneo via PIX</h4>
                <button
                  onClick={generatePixCode}
                  className="w-full bg-amber-600 text-white p-3 rounded-xl font-medium hover:bg-amber-700 transition-colors shadow-sm text-sm"
                >
                  📱 Gerar Código PIX
                </button>
                {pixCode && (
                  <div className={`text-center p-3.5 rounded-xl border ${
                    darkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
                  }`}>
                    <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Copie o código PIX abaixo:</p>
                    <p className={`font-mono text-base font-bold select-all ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{pixCode}</p>
                    <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Use este código no seu app de pagamento</p>
                  </div>
                )}
              </div>
            )}

            {selectedPaymentMethod === 'card' && (
              <div className={`p-4 rounded-xl border space-y-3 ${
                darkMode ? 'bg-gray-900/40 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className="font-medium text-sm">Dados do Cartão (Simulação Segura)</h4>
                <div>
                  <label className="block text-xs font-medium mb-1">Número do Cartão *</label>
                  <input
                    type="text"
                    placeholder="Somente dígitos (16 números)"
                    value={cardData.number}
                    onChange={(e) => setCardData({...cardData, number: onlyNumbers(e.target.value, 16)})}
                    className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                      darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Nome no Cartão *</label>
                  <input
                    type="text"
                    placeholder="Nome impresso no cartão"
                    value={cardData.name}
                    onChange={(e) => setCardData({...cardData, name: e.target.value})}
                    className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                      darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Validade *</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={cardData.expiry}
                      onChange={(e) => {
                        let val = onlyNumbers(e.target.value, 4);
                        if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
                        setCardData({...cardData, expiry: val});
                      }}
                      className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                        darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">CVV *</label>
                    <input
                      type="text"
                      placeholder="3 ou 4 dígitos"
                      maxLength={4}
                      value={cardData.cvv}
                      onChange={(e) => setCardData({...cardData, cvv: onlyNumbers(e.target.value, 4)})}
                      className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                        darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'cash' && (
              <div className={`p-4 rounded-xl border space-y-3 ${
                darkMode ? 'bg-gray-900/40 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className="font-medium text-sm">Pagamento em Dinheiro</h4>
                <div>
                  <label className="block text-xs font-medium mb-1">Troco para quanto? (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: 50.00"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(onlyDecimals(e.target.value))}
                    className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                      darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Total a pagar: <span className="font-bold text-amber-600">{formatPrice(orderData.total)}</span>
                </p>
                {cashAmount && parseFloat(cashAmount) > orderData.total && (
                  <p className="text-xs text-green-600 font-semibold">
                    Troco a receber: {formatPrice(parseFloat(cashAmount) - orderData.total)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer com botões */}
        <div className={`border-t p-6 ${darkMode ? 'border-gray-700 bg-gray-900/60' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-700 dark:text-gray-200 p-4 rounded-xl font-medium transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || !deliveryOption || processing}
              className="flex-1 bg-amber-600 text-white p-4 rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processando Pedido...
                </div>
              ) : (
                `💳 Confirmar e Pagar ${formatPrice(orderData.total)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
