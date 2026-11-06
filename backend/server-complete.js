const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Dados mock para testes
let orders = [];
let nextOrderId = 1;
let reservations = [];
let users = [
  {
    id: 1,
    uid: 'test-user',
    nome: 'Usuário de Teste',
    email: 'teste@caffe.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua de Teste, 123'
  }
];
let nextUserId = 2;

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando'
  });
});

// Usuários
app.post('/api/users', (req, res) => {
  const newUser = {
    id: nextUserId++,
    ...req.body,
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  console.log('Usuário criado:', newUser);
  res.json(newUser);
});

app.get('/api/users/:uid', (req, res) => {
  const user = users.find(u => u.uid === req.params.uid);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  res.json(user);
});

// Pedidos
app.post('/api/orders', (req, res) => {
  try {
    // Simular processamento de pagamento
    const paymentResult = processPayment(req.body.metodo_pagamento, req.body.total);

    if (!paymentResult.success) {
      return res.status(400).json({
        error: 'Falha no pagamento',
        message: paymentResult.message
      });
    }

    const newOrder = {
      id: nextOrderId++,
      ...req.body,
      status: 'confirmado', // Mudado de 'pendente' para 'confirmado'
      data_pedido: new Date().toISOString(),
      estimatedTime: Math.floor(Math.random() * 20) + 15, // 15-35 min
      codigo_transacao: paymentResult.transactionCode,
      pagamento_confirmado: true,
      data_pagamento: new Date().toISOString()
    };

    orders.push(newOrder);
    console.log('✅ Pedido criado e pago com sucesso:', newOrder);

    // Simular atualização de status após alguns segundos
    setTimeout(() => {
      const order = orders.find(o => o.id === newOrder.id);
      if (order) {
        order.status = 'preparando';
        console.log(`📋 Pedido ${newOrder.id} agora está sendo preparado`);
      }
    }, 3000);

    res.json({
      ...newOrder,
      message: 'Pagamento processado com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao processar o pedido'
    });
  }
});

// Função para simular processamento de pagamento
function processPayment(method, amount) {
  console.log(`💳 Processando pagamento: ${method} - R$ ${amount}`);

  switch (method.toLowerCase()) {
    case 'pix':
      return {
        success: true,
        message: 'PIX processado com sucesso',
        transactionCode: `PIX-${generateTransactionCode()}`
      };

    case 'cartao':
    case 'card':
      return {
        success: true,
        message: 'Cartão processado com sucesso',
        transactionCode: `CARD-${generateTransactionCode()}`
      };

    case 'dinheiro':
    case 'cash':
      return {
        success: true,
        message: 'Pagamento em dinheiro confirmado',
        transactionCode: `CASH-${generateTransactionCode()}`
      };

    default:
      return {
        success: false,
        message: 'Método de pagamento não suportado',
        transactionCode: null
      };
  }
}

// Função para gerar código de transação
function generateTransactionCode() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

app.get('/api/orders/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userOrders = orders.filter(order => order.usuario_id === userId);
  res.json(userOrders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  res.json(order);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  order.status = req.body.status;
  console.log('Status do pedido atualizado:', order);
  res.json(order);
});

// Cancelar/Deletar pedido
app.delete('/api/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const orderIndex = orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }

  const order = orders[orderIndex];

  // Verificar se o pedido pode ser cancelado
  if (order.status === 'entregue' || order.status === 'pronto') {
    return res.status(400).json({
      error: 'Não é possível cancelar este pedido',
      message: 'Pedidos já entregues ou prontos não podem ser cancelados'
    });
  }

  // Remover o pedido da lista
  orders.splice(orderIndex, 1);
  console.log(`🗑️ Pedido ${orderId} cancelado e removido`);

  res.json({
    message: 'Pedido cancelado com sucesso',
    canceledOrder: order
  });
});

// Cancelar pedido (alternativa com PATCH)
app.patch('/api/orders/:id/cancel', (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }

  // Verificar se o pedido pode ser cancelado
  if (order.status === 'entregue' || order.status === 'pronto') {
    return res.status(400).json({
      error: 'Não é possível cancelar este pedido',
      message: 'Pedidos já entregues ou prontos não podem ser cancelados'
    });
  }

  // Atualizar status para cancelado
  order.status = 'cancelado';
  order.data_cancelamento = new Date().toISOString();
  order.motivo_cancelamento = req.body.motivo || 'Cancelado pelo cliente';

  console.log(`❌ Pedido ${orderId} cancelado:`, order);

  res.json({
    message: 'Pedido cancelado com sucesso',
    order: order
  });
});

// Produtos (dados mock)
app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, nome: 'Café Expresso', preco: 5.00, categoria: 'coffee' },
    { id: 2, nome: 'Cappuccino', preco: 8.00, categoria: 'coffee' },
    { id: 3, nome: 'Latte', preco: 7.00, categoria: 'coffee' },
    { id: 4, nome: 'Croissant', preco: 5.00, categoria: 'snacks' },
    { id: 5, nome: 'Pão de Açúcar', preco: 15.50, categoria: 'sweets' },
    { id: 6, nome: 'Sanduíche Natural', preco: 12.00, categoria: 'snacks' },
    { id: 7, nome: 'Bolo de Chocolate', preco: 13.00, categoria: 'sweets' }
  ];
  res.json(products);
});

// Reservas (mock)
app.post('/api/reservations', (req, res) => {
  const newReservation = {
    id: Date.now(),
    ...req.body,
    status: 'pendente',
    data_reserva: new Date().toISOString()
  };
  console.log('Reserva criada:', newReservation);
  res.json(newReservation);
});

app.get('/api/reservations/user/:userId', (req, res) => {
  const mockReservations = [
    {
      id: 2001,
      usuario_id: parseInt(req.params.userId),
      data_reserva: '2024-01-20T19:00:00',
      pessoas: 4,
      status: 'confirmado',
      observacoes: 'Mesa próxima à janela'
    }
  ];
  res.json(mockReservations);
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  console.log('Rota não encontrada:', req.method, req.originalUrl);
  res.status(404).json({
    error: 'Endpoint não encontrado',
    method: req.method,
    url: req.originalUrl
  });
});

app.listen(port, () => {
  console.log(`Servidor completo rodando na porta ${port}`);
  console.log('Endpoints disponíveis:');
  console.log('- GET /api/health');
  console.log('- POST /api/users');
  console.log('- GET /api/users/:uid');
  console.log('- POST /api/orders');
  console.log('- GET /api/orders/user/:userId');
  console.log('- GET /api/orders/:id');
  console.log('- PATCH /api/orders/:id/status');
  console.log('- DELETE /api/orders/:id (cancelar pedido)');
  console.log('- PATCH /api/orders/:id/cancel (cancelar pedido)');
  console.log('- GET /api/products');
  console.log('- POST /api/reservations');
  console.log('- GET /api/reservations/user/:userId');
});

module.exports = app;
