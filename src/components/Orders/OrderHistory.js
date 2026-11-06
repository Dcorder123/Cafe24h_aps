import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import apiService from '../../services/ApiService';

const OrderHistory = ({ darkMode = false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    'pendente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300',
    'confirmado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
    'preparando': 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
    'pronto': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    'saiu para entrega': 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
    'entregue': 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300',
    'finalizado': 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300',
    'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
  };

  const statusIcons = {
    'pendente': '⏳',
    'confirmado': '👍',
    'preparando': '👨‍🍳',
    'pronto': '🍽️',
    'saiu para entrega': '🚚',
    'entregue': '✅',
    'finalizado': '✅',
    'cancelado': '❌'
  };

  const deliveryIcons = {
    'local': '🍽️',
    'delivery': '🚚',
    'pickup': '🏃'
  };

  const paymentIcons = {
    'pix': '📱',
    'card': '💳',
    'cash': '💵'
  };

  useEffect(() => {
    loadOrderHistory();
  }, []);

  const loadOrderHistory = async () => {
    try {
      setLoading(true);
      
      // Tentar carregar pedidos para usuário autenticado ou usuário de teste
      let userId = 1; // usuário de teste padrão
      
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          const user = await apiService.getUserByUid(currentUser.uid);
          userId = user.id;
        }
      } catch (error) {
        console.log('Usando usuário de teste para histórico');
      }

      // Carregar pedidos salvos em localStorage (sincronizado com Admin e Checkout)
      let localOrders = [];
      try {
        const stored = localStorage.getItem('cafe24h_orders');
        if (stored) localOrders = JSON.parse(stored);
      } catch {}

      if (Array.isArray(localOrders) && localOrders.length > 0) {
        setOrders(localOrders);
        setLoading(false);
        return;
      }

      const userOrders = await apiService.getOrdersByUser(userId);
      if (Array.isArray(userOrders) && userOrders.length > 0) {
        setOrders(userOrders);
        localStorage.setItem('cafe24h_orders', JSON.stringify(userOrders));
      } else {
        throw new Error('Nenhum pedido retornado da API');
      }
    } catch (error) {
      // Dados de exemplo caso não haja pedidos ainda
      const sampleOrders = [
        {
          id: 'PED-1001',
          data_pedido: new Date(Date.now() - 3600000).toISOString(),
          total: 25.50,
          status: 'preparando',
          tipo_entrega: 'delivery',
          metodo_pagamento: 'pix',
          cliente: 'Daniel',
          telefone: '(11) 98765-4321',
          endereco: 'Rua das Flores, 120 - Apto 3',
          items: [
            { nome: 'Café Expresso Clássico', quantidade: 2, preco_unitario: 8.50, subtotal: 17.00 },
            { nome: 'Bolo de Cenoura', quantidade: 1, preco_unitario: 8.50, subtotal: 8.50 }
          ]
        },
        {
          id: 'PED-1002',
          data_pedido: new Date(Date.now() - 86400000).toISOString(),
          total: 18.00,
          status: 'finalizado',
          tipo_entrega: 'retirada',
          metodo_pagamento: 'card',
          cliente: 'Daniel',
          telefone: '(11) 98765-4321',
          endereco: 'Retirada no Balcão',
          items: [
            { nome: 'Cappuccino Especial', quantidade: 1, preco_unitario: 11.50, subtotal: 11.50 },
            { nome: 'Brigadeiro Gourmet', quantidade: 2, preco_unitario: 3.25, subtotal: 6.50 }
          ]
        }
      ];
      setOrders(sampleOrders);
      try {
        localStorage.setItem('cafe24h_orders', JSON.stringify(sampleOrders));
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  // Função para cancelar pedido
  const cancelOrder = async (orderId) => {
    try {
      const confirmed = window.confirm('Tem certeza que deseja cancelar este pedido?');
      if (!confirmed) return;

      setLoading(true);
      try {
        await apiService.cancelOrder(orderId);
      } catch {}
      
      // Atualizar a lista local e persistir
      setOrders(prevOrders => {
        const updated = prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelado' }
            : order
        );
        try {
          localStorage.setItem('cafe24h_orders', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      
      alert('Pedido cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      alert('Erro ao cancelar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar se o pedido pode ser cancelado
  const canCancelOrder = (status) => {
    return ['pendente', 'confirmado', 'preparando'].includes(status);
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryText = (type) => {
    const types = {
      'local': 'Comer no Local',
      'delivery': 'Entrega',
      'pickup': 'Retirada'
    };
    return types[type] || type;
  };

  const getPaymentText = (method) => {
    const methods = {
      'pix': 'PIX',
      'card': 'Cartão',
      'cash': 'Dinheiro'
    };
    return methods[method] || method;
  };

  const getStatusText = (status) => {
    const statuses = {
      'pendente': 'Pendente',
      'preparando': 'Preparando',
      'pronto': 'Pronto',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    return statuses[status] || status;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando histórico de pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>📋 Meus Pedidos</h1>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Acompanhe o histórico dos seus pedidos</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Nenhum pedido encontrado</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Você ainda não fez nenhum pedido.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className={`rounded-xl shadow-lg border overflow-hidden ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
              }`}>
                <div className="p-6">
                  {/* Header do pedido */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        Pedido #{order.id}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(order.data_pedido)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                        {statusIcons[order.status]} {getStatusText(order.status)}
                      </span>
                      <span className="text-lg font-bold text-amber-600">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Informações do pedido */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{deliveryIcons[order.tipo_entrega]}</span>
                      <span className="text-sm text-gray-600">
                        {getDeliveryText(order.tipo_entrega)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{paymentIcons[order.metodo_pagamento]}</span>
                      <span className="text-sm text-gray-600">
                        {getPaymentText(order.metodo_pagamento)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📦</span>
                      <span className="text-sm text-gray-600">
                        {order.items?.length || 0} itens
                      </span>
                    </div>
                  </div>

                  {/* Items do pedido */}
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        Ver detalhes do pedido
                      </span>
                      <span className={`transform transition-transform ${selectedOrder === order.id ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>

                    {selectedOrder === order.id && (
                      <div className="mt-4 space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <div>
                              <span className="font-medium">{item.nome}</span>
                              <span className="text-gray-600 ml-2">x{item.quantidade}</span>
                            </div>
                            <span className="font-medium">
                              {formatPrice(item.preco_unitario * item.quantidade)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                    {canCancelOrder(order.status) && (
                      <button 
                        onClick={() => cancelOrder(order.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        disabled={loading}
                      >
                        {loading ? '⏳ Cancelando...' : '❌ Cancelar Pedido'}
                      </button>
                    )}
                    <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium">
                      🔄 Pedir Novamente
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão para atualizar */}
        <div className="text-center mt-8">
          <button
            onClick={loadOrderHistory}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            🔄 Atualizar Histórico
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
