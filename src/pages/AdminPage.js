import React, { useState, useEffect } from 'react';
import { CATEGORIES, PAGES } from '../utils/constants';
import { ProductService } from '../services/ProductService';
import { onlyDecimals, formatPhone } from '../utils/formatters';

const DEFAULT_TABLES = [
  { id: 1, name: 'Mesa 1', capacity: 2, status: 'livre' },
  { id: 2, name: 'Mesa 2', capacity: 4, status: 'ocupada' },
  { id: 3, name: 'Mesa 3', capacity: 4, status: 'livre' },
  { id: 4, name: 'Mesa 4', capacity: 6, status: 'ocupada' },
  { id: 5, name: 'Mesa 5', capacity: 2, status: 'livre' },
  { id: 6, name: 'Mesa 6', capacity: 4, status: 'livre' },
  { id: 7, name: 'Mesa 7', capacity: 8, status: 'livre' },
  { id: 8, name: 'Mesa 8', capacity: 2, status: 'livre' }
];

const AdminPage = ({
  isAdmin = false,
  onLoginSuccess,
  onLogout,
  onNavigate,
  darkMode = false
}) => {
  const [activeTab, setActiveTab] = useState('orders'); // orders, tables, reservations, products
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [notification, setNotification] = useState(null);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');

  // Tables State
  const [tables, setTables] = useState(() => {
    try {
      const stored = localStorage.getItem('cafe24h_tables');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_TABLES;
  });
  const [newTable, setNewTable] = useState({ name: '', capacity: 4 });

  // Reservations State
  const [reservations, setReservations] = useState([]);

  // Products State
  const [products, setProducts] = useState(() => ProductService.getInstance().loadProducts());
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: CATEGORIES.COFFEE,
    price: '',
    description: '',
    imageUrl: '',
    imagePreview: ''
  });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Carregar dados iniciais e assinar atualizações
  useEffect(() => {
    loadOrders();
    loadReservations();

    const unsubscribeProducts = ProductService.getInstance().subscribe((updated) => {
      setProducts([...updated]);
    });

    return () => unsubscribeProducts();
  }, []);

  const loadOrders = () => {
    try {
      const stored = localStorage.getItem('cafe24h_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          return;
        }
      }
    } catch {}

    // Exemplos iniciais caso não haja pedidos
    const initialOrders = [
      {
        id: 'PED-1001',
        data_pedido: new Date(Date.now() - 15 * 60000).toISOString(),
        total: 38.50,
        status: 'preparando',
        tipo_entrega: 'delivery',
        metodo_pagamento: 'pix',
        cliente: 'Mariana Silva',
        telefone: '(11) 98765-4321',
        endereco: 'Av. Paulista, 1500 - Apto 82',
        items: [
          { nome: 'Latte Cremoso', quantidade: 2, preco_unitario: 12.00, subtotal: 24.00 },
          { nome: 'Bolo de Cenoura', quantidade: 1, preco_unitario: 14.50, subtotal: 14.50 }
        ]
      },
      {
        id: 'PED-1002',
        data_pedido: new Date(Date.now() - 40 * 60000).toISOString(),
        total: 18.00,
        status: 'pendente',
        tipo_entrega: 'local',
        metodo_pagamento: 'card',
        cliente: 'Carlos Rocha',
        telefone: '(11) 91234-5678',
        endereco: 'Mesa 4 (No Local)',
        items: [
          { nome: 'Café Expresso Clássico', quantidade: 1, preco_unitario: 8.50, subtotal: 8.50 },
          { nome: 'Pudim de Leite', quantidade: 1, preco_unitario: 9.50, subtotal: 9.50 }
        ]
      },
      {
        id: 'PED-1003',
        data_pedido: new Date(Date.now() - 90 * 60000).toISOString(),
        total: 23.50,
        status: 'saiu para entrega',
        tipo_entrega: 'delivery',
        metodo_pagamento: 'pix',
        cliente: 'Ana Beatriz',
        telefone: '(11) 99887-7665',
        endereco: 'Rua Augusta, 450 - Casa 2',
        items: [
          { nome: 'Cappuccino Especial', quantidade: 2, preco_unitario: 11.50, subtotal: 23.00 }
        ]
      }
    ];
    setOrders(initialOrders);
    try {
      localStorage.setItem('cafe24h_orders', JSON.stringify(initialOrders));
    } catch {}
  };

  const loadReservations = () => {
    try {
      const stored = localStorage.getItem('cafe24h_reservations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReservations(parsed);
          return;
        }
      }
    } catch {}

    const sampleReservations = [
      {
        id: 1,
        name: 'Juliana Mendes',
        email: 'juliana@email.com',
        phone: '(11) 97766-5544',
        date: new Date().toISOString().split('T')[0],
        time: '19:30',
        guests: 4,
        tableAssigned: 'Mesa 2',
        status: 'Confirmada',
        specialRequests: 'Mesa próxima à janela se possível'
      },
      {
        id: 2,
        name: 'Roberto Santos',
        email: 'roberto@email.com',
        phone: '(11) 96655-4433',
        date: new Date().toISOString().split('T')[0],
        time: '20:00',
        guests: 2,
        tableAssigned: 'Mesa 5',
        status: 'Confirmada',
        specialRequests: ''
      }
    ];
    setReservations(sampleReservations);
    try {
      localStorage.setItem('cafe24h_reservations', JSON.stringify(sampleReservations));
    } catch {}
  };

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin' || password === 'admin123' || password === '1234') {
      onLoginSuccess();
      setPassword('');
      setLoginError('');
      showNotification('Autenticado com sucesso no Painel de Administração!');
    } else {
      setLoginError('Senha incorreta! Dica: utilize "admin" ou "1234"');
    }
  };

  // --- Pedidos Handlers ---
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus };
      }
      return ord;
    });
    setOrders(updated);
    try {
      localStorage.setItem('cafe24h_orders', JSON.stringify(updated));
    } catch {}
    showNotification(`Status do pedido #${orderId} atualizado para "${newStatus.toUpperCase()}"`);
  };

  // --- Mesas Handlers ---
  const saveTables = (newTablesList) => {
    setTables(newTablesList);
    try {
      localStorage.setItem('cafe24h_tables', JSON.stringify(newTablesList));
    } catch {}
  };

  const handleToggleTableStatus = (tableId) => {
    const updated = tables.map(t => {
      if (t.id === tableId) {
        const nextStatus = t.status === 'ocupada' ? 'livre' : 'ocupada';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    saveTables(updated);
    showNotification('Status da mesa atualizado com sucesso!');
  };

  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTable.name.trim()) {
      showNotification('Informe o nome ou número da mesa', 'error');
      return;
    }
    const created = {
      id: Date.now(),
      name: newTable.name.trim(),
      capacity: parseInt(newTable.capacity, 10) || 4,
      status: 'livre'
    };
    const updated = [...tables, created];
    saveTables(updated);
    setNewTable({ name: '', capacity: 4 });
    showNotification(`"${created.name}" cadastrada com sucesso!`);
  };

  const handleDeleteTable = (tableId) => {
    if (window.confirm('Tem certeza que deseja remover esta mesa?')) {
      const updated = tables.filter(t => t.id !== tableId);
      saveTables(updated);
      showNotification('Mesa removida com sucesso!');
    }
  };

  // --- Reservas Handlers ---
  const handleUpdateReservationStatus = (reservationId, newStatus) => {
    const updated = reservations.map(r => {
      if (r.id === reservationId) {
        return { ...r, status: newStatus };
      }
      return r;
    });
    setReservations(updated);
    try {
      localStorage.setItem('cafe24h_reservations', JSON.stringify(updated));
    } catch {}
    showNotification(`Reserva #${reservationId} atualizada para "${newStatus}"!`);
  };

  const handleAssignTableToReservation = (reservationId, tableName) => {
    const updated = reservations.map(r => {
      if (r.id === reservationId) {
        return { ...r, tableAssigned: tableName };
      }
      return r;
    });
    setReservations(updated);
    try {
      localStorage.setItem('cafe24h_reservations', JSON.stringify(updated));
    } catch {}
    showNotification(`Reserva vinculada à ${tableName}!`);
  };

  // --- Produtos Handlers ---
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification('A imagem deve ter no máximo 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target.result;
        setNewProduct(prev => ({
          ...prev,
          imageUrl: base64,
          imagePreview: base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price) {
      showNotification('Nome e preço são obrigatórios!', 'error');
      return;
    }

    const prod = ProductService.getInstance().addProduct({
      name: newProduct.name.trim(),
      description: newProduct.description.trim(),
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      imageUrl: newProduct.imageUrl || '/images/placeholder.svg'
    });

    setNewProduct({
      name: '',
      category: CATEGORIES.COFFEE,
      price: '',
      description: '',
      imageUrl: '',
      imagePreview: ''
    });

    showNotification(`Produto "${prod.name}" adicionado ao cardápio com sucesso!`);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Deseja realmente remover este produto do cardápio?')) {
      ProductService.getInstance().deleteProduct(productId);
      showNotification('Produto removido com sucesso!');
    }
  };

  // Contadores para o Dashboard
  const activeOrdersCount = orders.filter(o => !['finalizado', 'entregue', 'cancelado'].includes(o.status?.toLowerCase())).length;
  const occupiedTablesCount = tables.filter(t => t.status === 'ocupada').length;
  const pendingReservationsCount = reservations.filter(r => r.status !== 'Cancelada').length;

  // Filtragem de pedidos
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    const s = o.status?.toLowerCase();
    if (orderFilter === 'pending') return s === 'pendente' || s === 'aguardando confirmação';
    if (orderFilter === 'preparing') return s === 'preparando';
    if (orderFilter === 'ready') return s === 'pronto';
    if (orderFilter === 'out_for_delivery') return s === 'saiu para entrega';
    if (orderFilter === 'delivered') return s === 'finalizado' || s === 'entregue';
    if (orderFilter === 'cancelled') return s === 'cancelado';
    return true;
  });

  // Tela de Login caso não esteja autenticado
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-3xl shadow-xl transition-all border backdrop-blur-sm bg-white/90 dark:bg-gray-800/95 border-amber-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
            🛡️
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Painel do Administrador
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Área restrita de gestão: Pedidos, Mesas, Reservas e Cardápio.
          </p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha de administrador"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              💡 Senha para demonstração: <code className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 font-mono">admin</code> ou <code className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 font-mono">1234</code>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Acessar Painel
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => onNavigate && onNavigate(PAGES.MENU)}
            className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
          >
            ← Voltar ao Cardápio
          </button>
        </div>
      </div>
    );
  }

  // Dashboard do Administrador
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center justify-between shadow-lg transition-all animate-fadeIn ${
          notification.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-emerald-600 text-white'
        }`}>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>{notification.type === 'error' ? '⚠️' : '✅'}</span>
            <span>{notification.msg}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-white hover:opacity-75 text-sm font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className={`p-6 rounded-3xl shadow-sm border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        darkMode ? 'bg-gray-800/90 border-gray-700 text-white' : 'bg-white border-amber-100 text-gray-800'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Painel de Gestão Caffe 24h
            </h1>
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Controle integrado de pedidos em tempo real, ocupação de mesas, reservas e cardápio.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate && onNavigate(PAGES.MENU)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
          >
            <span>☕</span>
            <span>Ver Cardápio</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl font-medium text-sm bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 transition-all flex items-center gap-1.5"
            title="Sair do modo administrador"
          >
            <span>🚪</span>
            <span>Sair do Admin</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-2xl">📦</span>
            <span className="text-2xl font-black text-amber-500">{activeOrdersCount}</span>
          </div>
          <p className="text-xs uppercase font-bold tracking-wider mt-2 opacity-70">
            Pedidos Ativos
          </p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-2xl">🪑</span>
            <span className="text-2xl font-black text-red-500">{occupiedTablesCount} / {tables.length}</span>
          </div>
          <p className="text-xs uppercase font-bold tracking-wider mt-2 opacity-70">
            Mesas Ocupadas
          </p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-2xl">📅</span>
            <span className="text-2xl font-black text-blue-500">{pendingReservationsCount}</span>
          </div>
          <p className="text-xs uppercase font-bold tracking-wider mt-2 opacity-70">
            Reservas
          </p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-2xl">☕</span>
            <span className="text-2xl font-black text-emerald-500">{products.length}</span>
          </div>
          <p className="text-xs uppercase font-bold tracking-wider mt-2 opacity-70">
            Itens no Cardápio
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={`flex border-b overflow-x-auto gap-2 p-1 ${
        darkMode ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-amber-600 text-white shadow-md'
              : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span>📦</span>
          <span>Pedidos ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'tables'
              ? 'bg-amber-600 text-white shadow-md'
              : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span>🪑</span>
          <span>Mesas & Ocupação ({tables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reservations'
              ? 'bg-amber-600 text-white shadow-md'
              : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span>📅</span>
          <span>Reservas ({reservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-amber-600 text-white shadow-md'
              : darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span>☕</span>
          <span>Cadastrar & Produtos</span>
        </button>
      </div>

      {/* TAB 1: GESTÃO DE PEDIDOS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filtros de Status */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'pending', label: '⏳ Pendentes' },
              { id: 'preparing', label: '👨‍🍳 Em Preparo' },
              { id: 'ready', label: '🍽️ Prontos' },
              { id: 'out_for_delivery', label: '🚚 Saiu p/ Entrega' },
              { id: 'delivered', label: '✅ Finalizados' },
              { id: 'cancelled', label: '❌ Cancelados' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setOrderFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  orderFilter === f.id
                    ? 'bg-gray-900 text-white dark:bg-amber-500 dark:text-gray-950 shadow-sm'
                    : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${
              darkMode ? 'bg-gray-800/50 border-gray-700 text-gray-400' : 'bg-white border-amber-100 text-gray-500'
            }`}>
              <span className="text-4xl block mb-2">📭</span>
              <p className="font-semibold text-lg">Nenhum pedido encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map(order => {
                const normStatus = order.status?.toLowerCase() || 'pendente';
                const isOutForDelivery = normStatus === 'saiu para entrega';
                const isReady = normStatus === 'pronto';
                const isPreparing = normStatus === 'preparando';
                const isPending = normStatus === 'pendente' || normStatus === 'aguardando confirmação';
                const isDelivered = normStatus === 'finalizado' || normStatus === 'entregue';

                return (
                  <div
                    key={order.id}
                    className={`p-5 rounded-3xl border shadow-sm transition-all ${
                      darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4 mb-4 dark:border-gray-700">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-lg text-amber-600 dark:text-amber-400">
                            #{order.id}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isPending ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300' :
                            isPreparing ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' :
                            isReady ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300' :
                            isOutForDelivery ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 animate-pulse' :
                            isDelivered ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {order.data_pedido ? new Date(order.data_pedido).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>

                        <div className="text-sm font-semibold mt-1">
                          👤 {order.cliente || 'Cliente'} {order.telefone && <span className="font-normal text-xs opacity-75">({formatPhone(order.telefone)})</span>}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {order.tipo_entrega === 'delivery' ? '🚚 Delivery:' : order.tipo_entrega === 'local' ? '🍽️ No Local:' : '🏃 Retirada:'} {order.endereco || 'Balcão'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Ações de Status Rápido */}
                        {isPending && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'preparando')}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>👨‍🍳</span>
                            <span>Iniciar Preparo</span>
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'pronto')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>🍽️</span>
                            <span>Marcar como Pronto</span>
                          </button>
                        )}

                        {isReady && order.tipo_entrega === 'delivery' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'saiu para entrega')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>🚚</span>
                            <span>Saiu para Entrega</span>
                          </button>
                        )}

                        {(isOutForDelivery || (isReady && order.tipo_entrega !== 'delivery')) && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'finalizado')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>✅</span>
                            <span>Finalizar Pedido</span>
                          </button>
                        )}

                        {/* Seletor manual para qualquer status */}
                        <select
                          value={normStatus}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'
                          }`}
                        >
                          <option value="pendente">⏳ Pendente</option>
                          <option value="preparando">👨‍🍳 Preparando</option>
                          <option value="pronto">🍽️ Pronto</option>
                          <option value="saiu para entrega">🚚 Saiu para Entrega</option>
                          <option value="finalizado">✅ Finalizado</option>
                          <option value="cancelado">❌ Cancelado</option>
                        </select>
                      </div>
                    </div>

                    {/* Itens do Pedido */}
                    <div className="space-y-1.5 text-sm">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="font-medium">
                            {item.quantidade}x {item.nome}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            R$ {(item.preco_unitario * item.quantidade).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-3 pt-3 flex justify-between items-center dark:border-gray-700">
                      <span className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                        Pagamento: <strong className="text-gray-900 dark:text-gray-200">{order.metodo_pagamento?.toUpperCase() || 'PIX'}</strong>
                      </span>
                      <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                        Total: R$ {parseFloat(order.total || 0).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GESTÃO DE MESAS & OCUPAÇÃO */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {/* Formulário de Cadastro de Nova Mesa */}
          <div className={`p-6 rounded-3xl border shadow-sm ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-amber-100 text-gray-800'
          }`}>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <span>➕</span>
              <span>Cadastrar Nova Mesa</span>
            </h3>

            <form onSubmit={handleAddTable} className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-75">
                  Identificação da Mesa *
                </label>
                <input
                  type="text"
                  value={newTable.name}
                  onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                  placeholder="Ex: Mesa 9 ou Varanda 2"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-75">
                  Capacidade (Lugares)
                </label>
                <select
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value, 10) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={2}>2 Pessoas</option>
                  <option value={4}>4 Pessoas</option>
                  <option value={6}>6 Pessoas</option>
                  <option value={8}>8 Pessoas</option>
                  <option value={10}>10 Pessoas</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  <span>🪑</span>
                  <span>Cadastrar Mesa</span>
                </button>
              </div>
            </form>
          </div>

          {/* Grid de Mesas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map(table => {
              const isOccupied = table.status === 'ocupada';

              return (
                <div
                  key={table.id}
                  className={`p-5 rounded-3xl border-2 transition-all shadow-sm flex flex-col justify-between ${
                    isOccupied
                      ? 'border-red-500/40 bg-red-500/5 dark:bg-red-950/20'
                      : 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🪑</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        isOccupied
                          ? 'bg-red-500 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}>
                        {isOccupied ? 'Ocupada' : 'Livre'}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-gray-900 dark:text-white">
                      {table.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      👥 Capacidade: {table.capacity} pessoas
                    </p>
                  </div>

                  <div className="mt-5 space-y-2">
                    <button
                      onClick={() => handleToggleTableStatus(table.id)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isOccupied
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                      }`}
                    >
                      <span>{isOccupied ? '🟢' : '🔴'}</span>
                      <span>{isOccupied ? 'Liberar Mesa' : 'Marcar Ocupada'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTable(table.id)}
                      className="w-full py-1 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      🗑️ Excluir Mesa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GESTÃO DE RESERVAS */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${
              darkMode ? 'bg-gray-800/50 border-gray-700 text-gray-400' : 'bg-white border-amber-100 text-gray-500'
            }`}>
              <span className="text-4xl block mb-2">📅</span>
              <p className="font-semibold text-lg">Nenhuma reserva registrada no momento.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reservations.map(res => (
                <div
                  key={res.id}
                  className={`p-5 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-black">{res.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        res.status === 'Confirmada'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : res.status === 'Cancelada'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300'
                      }`}>
                        {res.status || 'Confirmada'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2 flex-wrap">
                      <span>📞 {res.phone ? formatPhone(res.phone) : 'Sem tel'}</span>
                      <span>📅 {res.date}</span>
                      <span>⏰ {res.time}</span>
                      <span>👥 {res.guests} pessoas</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        🪑 {res.tableAssigned || 'Sem mesa atribuída'}
                      </span>
                    </div>

                    {res.specialRequests && (
                      <p className="text-xs bg-amber-500/10 p-2 rounded-lg mt-2 text-amber-700 dark:text-amber-300">
                        <strong>Obs:</strong> {res.specialRequests}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Atribuir Mesa */}
                    <select
                      value={res.tableAssigned || ''}
                      onChange={(e) => handleAssignTableToReservation(res.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <option value="">Atribuir Mesa...</option>
                      {tables.map(t => (
                        <option key={t.id} value={t.name}>
                          {t.name} ({t.capacity}p - {t.status})
                        </option>
                      ))}
                    </select>

                    {res.status !== 'Confirmada' && (
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'Confirmada')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                      >
                        Confirmar
                      </button>
                    )}

                    {res.status !== 'Cancelada' && (
                      <button
                        onClick={() => handleUpdateReservationStatus(res.id, 'Cancelada')}
                        className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold border border-red-500/30"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CARDÁPIO & PRODUTOS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Formulário de Cadastro de Produto com Envio de Foto */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-amber-100 text-gray-800'
          }`}>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <span>☕</span>
              <span>Cadastrar Novo Produto no Cardápio</span>
            </h3>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-75">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Ex: Frappé de Caramelo"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-75">
                    Categoria *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value={CATEGORIES.COFFEE}>Cafés</option>
                    <option value={CATEGORIES.TEA}>Chás</option>
                    <option value={CATEGORIES.SNACKS}>Salgados</option>
                    <option value={CATEGORIES.SWEETS}>Doces</option>
                    <option value={CATEGORIES.DRINKS}>Bebidas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-75">
                    Preço (R$) *
                  </label>
                  <input
                    type="text"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: onlyDecimals(e.target.value) })}
                    placeholder="Ex: 14.90"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-75">
                  Descrição
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Descrição apetitosa com ingredientes e detalhes do produto..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Upload e Foto do Produto */}
              <div className="border border-dashed border-amber-300 dark:border-gray-600 rounded-2xl p-4 bg-amber-50/50 dark:bg-gray-900/30">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-amber-900 dark:text-amber-400">
                  📸 Foto do Produto (Upload de Arquivo ou URL)
                </label>

                <div className="grid sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-medium mb-1 opacity-75">
                      1. Escolha uma foto do seu dispositivo:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Formatos aceitos: JPG, PNG, WEBP (Máx. 2MB).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1 opacity-75">
                      2. Ou insira a URL da imagem:
                    </label>
                    <input
                      type="text"
                      value={newProduct.imageUrl.startsWith('data:') ? '' : newProduct.imageUrl}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        imageUrl: e.target.value,
                        imagePreview: e.target.value
                      })}
                      placeholder="https://exemplo.com/foto.jpg"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Preview da Foto */}
                {newProduct.imagePreview && (
                  <div className="mt-4 flex items-center gap-3 bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-amber-200 dark:border-gray-700 w-fit">
                    <img
                      src={newProduct.imagePreview}
                      alt="Preview do produto"
                      className="w-16 h-16 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Foto carregada com sucesso!
                      </p>
                      <button
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, imageUrl: '', imagePreview: '' })}
                        className="text-xs text-red-500 hover:underline mt-1 font-semibold"
                      >
                        Remover foto
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
              >
                ➕ Cadastrar Produto no Cardápio
              </button>
            </form>
          </div>

          {/* Lista de Produtos Cadastrados */}
          <div className={`p-6 rounded-3xl border shadow-sm ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-amber-100 text-gray-800'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                Cardápio Atual ({products.length} itens)
              </h3>

              <button
                onClick={() => {
                  if (window.confirm('Deseja restaurar todos os produtos originais do cardápio?')) {
                    localStorage.removeItem('cafe24h_custom_products');
                    window.location.reload();
                  }
                }}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Restaurar Cardápio Padrão
              </button>
            </div>

            <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-1">
              {products.map(product => (
                <div
                  key={product.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    darkMode ? 'bg-gray-900/40 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      onError={(e) => { e.target.src = '/images/placeholder.svg'; }}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-100 shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {product.category} • R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm"
                    title="Excluir este produto"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
