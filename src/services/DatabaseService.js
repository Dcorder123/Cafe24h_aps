const mysql = require('mysql2/promise');

class DatabaseService {
  constructor() {
    this.connection = null;
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'caffe_db',
      charset: 'utf8mb4'
    };
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log('✅ Conectado ao banco de dados MySQL');
      return this.connection;
    } catch (error) {
      console.error('❌ Erro ao conectar com o banco de dados:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log('🔌 Desconectado do banco de dados');
    }
  }

  // Métodos para usuários
  async createUser(userData) {
    const { uid, nome, email, telefone, endereco } = userData;
    const [result] = await this.connection.execute(
      'INSERT INTO usuarios (uid, nome, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)',
      [uid, nome, email, telefone, endereco]
    );
    return result.insertId;
  }

  async getUserByUid(uid) {
    const [rows] = await this.connection.execute(
      'SELECT * FROM usuarios WHERE uid = ?',
      [uid]
    );
    return rows[0];
  }

  async updateUser(uid, userData) {
    const { nome, email, telefone, endereco } = userData;
    const [result] = await this.connection.execute(
      'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE uid = ?',
      [nome, email, telefone, endereco, uid]
    );
    return result.affectedRows > 0;
  }

  // Métodos para produtos
  async getProducts(categoria = null) {
    let query = `
      SELECT p.*, c.nome as categoria_nome, c.icone as categoria_icone 
      FROM produtos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.disponivel = true
    `;
    let params = [];

    if (categoria && categoria !== 'all') {
      query += ' AND c.nome = ?';
      params.push(categoria);
    }

    query += ' ORDER BY p.nome';

    const [rows] = await this.connection.execute(query, params);
    return rows;
  }

  async getProductById(id) {
    const [rows] = await this.connection.execute(
      'SELECT * FROM produtos WHERE id = ? AND disponivel = true',
      [id]
    );
    return rows[0];
  }

  // Métodos para categorias
  async getCategories() {
    const [rows] = await this.connection.execute(
      'SELECT * FROM categorias WHERE ativo = true ORDER BY id'
    );
    return rows;
  }

  // Métodos para pedidos
  async createOrder(orderData) {
    const connection = await mysql.createConnection(this.config);
    
    try {
      await connection.beginTransaction();

      // Criar o pedido principal
      const [orderResult] = await connection.execute(
        'INSERT INTO pedidos (usuario_id, total, tipo_entrega, metodo_pagamento, endereco_entrega, observacoes) VALUES (?, ?, ?, ?, ?, ?)',
        [
          orderData.usuario_id,
          orderData.total,
          orderData.tipo_entrega,
          orderData.metodo_pagamento,
          orderData.endereco_entrega,
          orderData.observacoes
        ]
      );

      const pedidoId = orderResult.insertId;

      // Inserir itens do pedido
      for (const item of orderData.items) {
        await connection.execute(
          'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
          [pedidoId, item.produto_id, item.quantidade, item.preco_unitario, item.subtotal]
        );
      }

      // Criar registro de pagamento
      await connection.execute(
        'INSERT INTO pagamentos (pedido_id, metodo, valor, codigo_transacao, dados_pagamento) VALUES (?, ?, ?, ?, ?)',
        [
          pedidoId,
          orderData.metodo_pagamento,
          orderData.total,
          orderData.codigo_transacao || null,
          JSON.stringify(orderData.dados_pagamento || {})
        ]
      );

      await connection.commit();
      return pedidoId;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  }

  async getOrdersByUser(userId) {
    const [rows] = await this.connection.execute(`
      SELECT 
        p.*,
        GROUP_CONCAT(
          CONCAT(pr.nome, ' (', ip.quantidade, 'x)')
          SEPARATOR ', '
        ) as itens
      FROM pedidos p
      LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
      LEFT JOIN produtos pr ON ip.produto_id = pr.id
      WHERE p.usuario_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [userId]);
    return rows;
  }

  async getOrderById(orderId) {
    const [orderRows] = await this.connection.execute(`
      SELECT p.*, u.nome as usuario_nome, u.email as usuario_email
      FROM pedidos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
    `, [orderId]);

    if (orderRows.length === 0) return null;

    const order = orderRows[0];

    // Buscar itens do pedido
    const [itemRows] = await this.connection.execute(`
      SELECT ip.*, pr.nome as produto_nome, pr.imagem_url
      FROM itens_pedido ip
      LEFT JOIN produtos pr ON ip.produto_id = pr.id
      WHERE ip.pedido_id = ?
    `, [orderId]);

    order.itens = itemRows;
    return order;
  }

  async updateOrderStatus(orderId, status) {
    const [result] = await this.connection.execute(
      'UPDATE pedidos SET status_pedido = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, orderId]
    );
    return result.affectedRows > 0;
  }

  // Métodos para reservas
  async createReservation(reservationData) {
    const [result] = await this.connection.execute(
      'INSERT INTO reservas (usuario_id, nome, email, telefone, data_reserva, hora_reserva, numero_pessoas, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        reservationData.usuario_id,
        reservationData.nome,
        reservationData.email,
        reservationData.telefone,
        reservationData.data_reserva,
        reservationData.hora_reserva,
        reservationData.numero_pessoas,
        reservationData.observacoes
      ]
    );
    return result.insertId;
  }

  async getReservationsByUser(userId) {
    const [rows] = await this.connection.execute(
      'SELECT * FROM reservas WHERE usuario_id = ? ORDER BY data_reserva DESC, hora_reserva DESC',
      [userId]
    );
    return rows;
  }

  async getAvailableTables(data, hora, pessoas) {
    const [rows] = await this.connection.execute(`
      SELECT m.* FROM mesas m
      WHERE m.capacidade >= ?
      AND m.status = 'disponivel'
      AND m.id NOT IN (
        SELECT DISTINCT r.mesa_id FROM reservas r
        WHERE r.data_reserva = ?
        AND r.hora_reserva = ?
        AND r.status = 'confirmada'
        AND r.mesa_id IS NOT NULL
      )
      ORDER BY m.capacidade ASC
    `, [pessoas, data, hora]);
    return rows;
  }

  async assignTableToReservation(reservationId, tableId) {
    const [result] = await this.connection.execute(
      'UPDATE reservas SET mesa_id = ?, status = "confirmada" WHERE id = ?',
      [tableId, reservationId]
    );
    return result.affectedRows > 0;
  }

  // Métodos para notificações
  async createNotification(notificationData) {
    const [result] = await this.connection.execute(
      'INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem) VALUES (?, ?, ?, ?)',
      [
        notificationData.usuario_id,
        notificationData.tipo,
        notificationData.titulo,
        notificationData.mensagem
      ]
    );
    return result.insertId;
  }

  async getUserNotifications(userId, limit = 10) {
    const [rows] = await this.connection.execute(
      'SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
    return rows;
  }

  async markNotificationAsRead(notificationId) {
    const [result] = await this.connection.execute(
      'UPDATE notificacoes SET lida = true WHERE id = ?',
      [notificationId]
    );
    return result.affectedRows > 0;
  }

  // Métodos para relatórios
  async getSalesReport(startDate, endDate) {
    const [rows] = await this.connection.execute(`
      SELECT * FROM vendas_resumo 
      WHERE data BETWEEN ? AND ?
      ORDER BY data DESC
    `, [startDate, endDate]);
    return rows;
  }

  async getTopProducts(limit = 10) {
    const [rows] = await this.connection.execute(
      'SELECT * FROM produtos_mais_vendidos LIMIT ?',
      [limit]
    );
    return rows;
  }

  async getTableStatus() {
    const [rows] = await this.connection.execute('SELECT * FROM status_mesas');
    return rows;
  }
}

module.exports = DatabaseService;
