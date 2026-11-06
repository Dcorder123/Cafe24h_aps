const assert = require('assert');
const http = require('http');
const app = require('./server-complete');

// Sobe o servidor em porta efêmera aleatória
const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const request = (path, options = {}) => {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const req = http.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });
      req.on('error', reject);
      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    });
  };

  try {
    console.log('🧪 Iniciando testes de integração da API Backend Caffe 24h...');

    // 1. Healthcheck
    const health = await request('/api/health');
    assert.strictEqual(health.status, 200, 'Health check deve retornar 200');
    assert.strictEqual(health.body.status, 'OK', 'Status deve ser OK');
    console.log('  ✓ GET /api/health -> 200 OK');

    // 2. Criar pedido
    const orderPayload = {
      usuario_id: 1,
      total: 35.0,
      tipo_entrega: 'delivery',
      metodo_pagamento: 'pix',
      items: [
        { produto_id: 'prod001', nome: 'Café Expresso', quantidade: 2, preco_unitario: 8.5 }
      ]
    };

    const createOrder = await request('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: orderPayload
    });

    assert.ok([200, 201].includes(createOrder.status), 'Criação de pedido deve retornar 200 ou 201');
    assert.ok(createOrder.body.id, 'Pedido criado deve conter um ID');
    console.log(`  ✓ POST /api/orders -> Pedido #${createOrder.body.id} criado`);

    // 3. Consultar pedido criado
    const getOrder = await request(`/api/orders/${createOrder.body.id}`);
    assert.strictEqual(getOrder.status, 200, 'Busca por ID deve retornar 200');
    assert.strictEqual(getOrder.body.id, createOrder.body.id, 'ID retornado deve ser o mesmo');
    console.log('  ✓ GET /api/orders/:id -> Pedido recuperado com sucesso');

    console.log('\n🎉 Todos os testes de integração do backend passaram com sucesso!');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Falha nos testes de integração:', err);
    server.close();
    process.exit(1);
  }
});

