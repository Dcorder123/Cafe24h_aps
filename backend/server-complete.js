const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Dados mock para testes
let orders = [];
let nextOrderId = 1;
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
  const newOrder = {
    id: nextOrderId++,
    ...req.body,
    status: 'pendente',
    data_pedido: new Date().toISOString(),
    estimatedTime: 30
  };
  orders.push(newOrder);
  console.log('Pedido criado:', newOrder);
  res.json(newOrder);
});

app.get('/api/orders/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userOrders = orders.filter(order => order.usuario_id === userId);
  
  // Adicionar dados mock se não houver pedidos
  if (userOrders.length === 0) {
    const mockOrders = [
      {
        id: 1001,
        usuario_id: userId,
        data_pedido: '2024-01-15T10:30:00',
        total: 25.50,
        status: 'entregue',
        tipo_entrega: 'delivery',
        metodo_pagamento: 'pix',
        items: [
          { nome: 'Café Expresso', quantidade: 2, preco_unitario: 5.00 },
          { nome: 'Pão de Açúcar', quantidade: 1, preco_unitario: 15.50 }
        ]
      },
      {
        id: 1002,
        usuario_id: userId,
        data_pedido: '2024-01-10T14:15:00',
        total: 18.00,
        status: 'preparando',
        tipo_entrega: 'pickup',
        metodo_pagamento: 'card',
        items: [
          { nome: 'Cappuccino', quantidade: 1, preco_unitario: 8.00 },
          { nome: 'Croissant', quantidade: 2, preco_unitario: 5.00 }
        ]
      },
      {
        id: 1003,
        usuario_id: userId,
        data_pedido: '2024-01-05T16:45:00',
        total: 32.00,
        status: 'pronto',
        tipo_entrega: 'local',
        metodo_pagamento: 'cash',
        items: [
          { nome: 'Latte', quantidade: 1, preco_unitario: 7.00 },
          { nome: 'Sanduíche Natural', quantidade: 1, preco_unitario: 12.00 },
          { nome: 'Bolo de Chocolate', quantidade: 1, preco_unitario: 13.00 }
        ]
      }
    ];
    return res.json(mockOrders);
  }
  
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
  console.log('- GET /api/products');
  console.log('- POST /api/reservations');
  console.log('- GET /api/reservations/user/:userId');
});

module.exports = app;
