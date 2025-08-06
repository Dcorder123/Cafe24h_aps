const express = require('express');
const cors = require('cors');
const DatabaseService = require('./src/services/DatabaseService');

const app = express();
const port = process.env.PORT || 3001;
const db = new DatabaseService();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados
async function initializeDatabase() {
  try {
    await db.connect();
    console.log('🚀 Servidor iniciado na porta', port);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

// Rotas para produtos
app.get('/api/products', async (req, res) => {
  try {
    const { categoria } = req.query;
    const products = await db.getProducts(categoria);
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas para categorias
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas para usuários
app.post('/api/users', async (req, res) => {
  try {
    const userId = await db.createUser(req.body);
    res.status(201).json({ id: userId, message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/users/:uid', async (req, res) => {
  try {
    const user = await db.getUserByUid(req.params.uid);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/users/:uid', async (req, res) => {
  try {
    const updated = await db.updateUser(req.params.uid, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas para pedidos
app.post('/api/orders', async (req, res) => {
  try {
    const orderId = await db.createOrder(req.body);
    
    // Criar notificação para o usuário
    await db.createNotification({
      usuario_id: req.body.usuario_id,
      tipo: 'pedido',
      titulo: 'Pedido Confirmado!',
      mensagem: `Seu pedido #${orderId} foi confirmado e está sendo preparado.`
    });

    res.status(201).json({ 
      id: orderId, 
      message: 'Pedido criado com sucesso',
      estimatedTime: 30 
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await db.getOrdersByUser(req.params.userId);
    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await db.updateOrderStatus(req.params.id, status);
    
    if (!updated) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json({ message: 'Status do pedido atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas para reservas
app.post('/api/reservations', async (req, res) => {
  try {
    const reservationId = await db.createReservation(req.body);
    
    // Tentar atribuir uma mesa automaticamente
    const availableTables = await db.getAvailableTables(
      req.body.data_reserva,
      req.body.hora_reserva,
      req.body.numero_pessoas
    );

    if (availableTables.length > 0) {
      await db.assignTableToReservation(reservationId, availableTables[0].id);
    }

    // Criar notificação para o usuário
    if (req.body.usuario_id) {
      await db.createNotification({
        usuario_id: req.body.usuario_id,
        tipo: 'reserva',
        titulo: 'Reserva Confirmada!',
        mensagem: `Sua reserva para ${req.body.data_reserva} às ${req.body.hora_reserva} foi confirmada.`
      });
    }

    res.status(201).json({ 
      id: reservationId, 
      message: 'Reserva criada com sucesso',
      tableAssigned: availableTables.length > 0
    });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/reservations/user/:userId', async (req, res) => {
  try {
    const reservations = await db.getReservationsByUser(req.params.userId);
    res.json(reservations);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/tables/available', async (req, res) => {
  try {
    const { date, time, guests } = req.query;
    const tables = await db.getAvailableTables(date, time, parseInt(guests));
    res.json(tables);
  } catch (error) {
    console.error('Erro ao buscar mesas disponíveis:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas para notificações
app.get('/api/notifications/user/:userId', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const notifications = await db.getUserNotifications(req.params.userId, parseInt(limit));
    res.json(notifications);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const updated = await db.markNotificationAsRead(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }
    res.json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas para relatórios (admin)
app.get('/api/reports/sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await db.getSalesReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/reports/top-products', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await db.getTopProducts(parseInt(limit));
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos mais vendidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/tables/status', async (req, res) => {
  try {
    const tables = await db.getTableStatus();
    res.json(tables);
  } catch (error) {
    console.error('Erro ao buscar status das mesas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Caffe funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware para tratar rotas não encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicializar servidor
async function startServer() {
  await initializeDatabase();
  
  app.listen(port, () => {
    console.log(`🌐 API disponível em http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await db.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await db.disconnect();
  process.exit(0);
});

startServer().catch(console.error);

module.exports = app;
