-- Banco de dados para o Sistema Caffe
-- Execute este script no MySQL para criar a estrutura completa

CREATE DATABASE IF NOT EXISTS caffe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE caffe_db;

-- Tabela de usuários/clientes
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(255) UNIQUE NOT NULL, -- Firebase UID
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de categorias de produtos
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    icone VARCHAR(10),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria_id INT,
    imagem_url VARCHAR(255),
    disponivel BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabela de mesas
CREATE TABLE mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT UNIQUE NOT NULL,
    capacidade INT NOT NULL,
    status ENUM('disponivel', 'ocupada', 'reservada', 'manutencao') DEFAULT 'disponivel',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de reservas
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    mesa_id INT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data_reserva DATE NOT NULL,
    hora_reserva TIME NOT NULL,
    numero_pessoas INT NOT NULL,
    observacoes TEXT,
    status ENUM('pendente', 'confirmada', 'cancelada', 'finalizada') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (mesa_id) REFERENCES mesas(id)
);

-- Tabela de pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    reserva_id INT NULL, -- Se o pedido está associado a uma reserva
    total DECIMAL(10,2) NOT NULL,
    tipo_entrega ENUM('local', 'delivery', 'pickup') NOT NULL,
    metodo_pagamento ENUM('pix', 'card', 'cash') NOT NULL,
    status_pedido ENUM('pendente', 'preparando', 'pronto', 'entregue', 'cancelado') DEFAULT 'pendente',
    status_pagamento ENUM('pendente', 'processando', 'aprovado', 'recusado') DEFAULT 'pendente',
    endereco_entrega TEXT NULL,
    observacoes TEXT,
    tempo_estimado INT DEFAULT 30, -- em minutos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (reserva_id) REFERENCES reservas(id)
);

-- Tabela de itens do pedido
CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Tabela de pagamentos
CREATE TABLE pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    metodo ENUM('pix', 'card', 'cash') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    status ENUM('pendente', 'processando', 'aprovado', 'recusado', 'estornado') DEFAULT 'pendente',
    codigo_transacao VARCHAR(255),
    dados_pagamento JSON, -- Para armazenar dados específicos do pagamento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- Tabela de avaliações
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    usuario_id INT NOT NULL,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de notificações
CREATE TABLE notificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    tipo ENUM('pedido', 'reserva', 'promocao', 'geral') NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Inserir dados iniciais

-- Categorias
INSERT INTO categorias (nome, icone) VALUES
('Todos', '🍽️'),
('Cafés', '☕'),
('Chás', '🍵'),
('Salgados', '🥐'),
('Doces', '🧁'),
('Bebidas', '🥤');

-- Mesas
INSERT INTO mesas (numero, capacidade) VALUES
(1, 2), (2, 2), (3, 4), (4, 4), (5, 6), (6, 6), (7, 8), (8, 2), (9, 4), (10, 4);

-- Produtos exemplo
INSERT INTO produtos (nome, descricao, preco, categoria_id, imagem_url) VALUES
-- Cafés
('Espresso', 'Café espresso tradicional', 4.50, 2, '/images/espresso.jpg'),
('Cappuccino', 'Café com leite vaporizado e espuma', 7.50, 2, '/images/cappuccino.jpg'),
('Latte', 'Café com muito leite vaporizado', 8.00, 2, '/images/latte.jpg'),
('Americano', 'Café espresso com água quente', 5.50, 2, '/images/americano.jpg'),

-- Chás
('Chá Verde', 'Chá verde natural', 4.00, 3, '/images/cha-verde.jpg'),
('Chá Preto', 'Chá preto tradicional', 4.00, 3, '/images/cha-preto.jpg'),
('Chá de Camomila', 'Chá calmante de camomila', 4.50, 3, '/images/cha-camomila.jpg'),

-- Salgados
('Croissant', 'Croissant francês tradicional', 6.50, 4, '/images/croissant.jpg'),
('Pão de Açúcar', 'Pão doce brasileiro', 5.00, 4, '/images/pao-acucar.jpg'),
('Sanduíche Natural', 'Sanduíche com ingredientes naturais', 12.00, 4, '/images/sanduiche-natural.jpg'),

-- Doces
('Brigadeiro', 'Brigadeiro gourmet', 3.50, 5, '/images/brigadeiro.jpg'),
('Cheesecake', 'Cheesecake de frutas vermelhas', 9.50, 5, '/images/cheesecake.jpg'),
('Brownie', 'Brownie de chocolate', 7.00, 5, '/images/brownie.jpg'),

-- Bebidas
('Suco de Laranja', 'Suco natural de laranja', 6.00, 6, '/images/suco-laranja.jpg'),
('Água Mineral', 'Água mineral gelada', 3.00, 6, '/images/agua-mineral.jpg'),
('Refrigerante', 'Refrigerante gelado', 4.50, 6, '/images/refrigerante.jpg');

-- Criar índices para performance
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_status ON pedidos(status_pedido);
CREATE INDEX idx_reservas_data ON reservas(data_reserva, hora_reserva);
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id, lida);

-- Views úteis

-- View para relatório de vendas
CREATE VIEW vendas_resumo AS
SELECT 
    DATE(p.created_at) as data,
    COUNT(p.id) as total_pedidos,
    SUM(p.total) as receita_total,
    AVG(p.total) as ticket_medio
FROM pedidos p 
WHERE p.status_pedido != 'cancelado'
GROUP BY DATE(p.created_at)
ORDER BY data DESC;

-- View para produtos mais vendidos
CREATE VIEW produtos_mais_vendidos AS
SELECT 
    pr.nome,
    pr.preco,
    SUM(ip.quantidade) as total_vendido,
    SUM(ip.subtotal) as receita_produto
FROM produtos pr
JOIN itens_pedido ip ON pr.id = ip.produto_id
JOIN pedidos p ON ip.pedido_id = p.id
WHERE p.status_pedido != 'cancelado'
GROUP BY pr.id, pr.nome, pr.preco
ORDER BY total_vendido DESC;

-- View para status das mesas
CREATE VIEW status_mesas AS
SELECT 
    m.numero,
    m.capacidade,
    m.status,
    r.nome as reservado_para,
    r.data_reserva,
    r.hora_reserva
FROM mesas m
LEFT JOIN reservas r ON m.id = r.mesa_id 
    AND r.status = 'confirmada' 
    AND r.data_reserva = CURDATE()
ORDER BY m.numero;
