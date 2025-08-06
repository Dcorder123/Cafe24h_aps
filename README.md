# ☕ Café 24h - Sistema de Gerenciamento de Cafeteria

> Sistema web completo para gerenciamento de cafeteria desenvolvido com React + Node.js

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)](https://netlify.com/)

## 📋 Sobre o Projeto

Sistema de cafeteria desenvolvido para APS (Atividade Prática Supervisionada) que permite aos clientes:

- 🛒 **Fazer pedidos** online com carrinho intuitivo
- 💳 **Pagar** via PIX, cartão ou dinheiro
- 📅 **Reservar mesas** para atendimento presencial
- 📱 **Acompanhar** histórico de pedidos em tempo real
- 🍽️ **Escolher** modalidade de entrega (local, delivery, retirada)

## 🎯 Funcionalidades

### 👤 Para Clientes
- ✅ Cadastro e autenticação (Firebase)
- ✅ Navegação por categorias de produtos
- ✅ Carrinho de compras com persistência
- ✅ Sistema de pedidos completo
- ✅ Múltiplas formas de pagamento
- ✅ Reserva de mesas
- ✅ Histórico de pedidos
- ✅ Interface responsiva

### 🏪 Para o Estabelecimento
- ✅ Gerenciamento de produtos
- ✅ Controle de pedidos e status
- ✅ Sistema de reservas
- ✅ Relatórios de vendas
- ✅ Notificações em tempo real

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18.2.0** - Interface de usuário
- **Tailwind CSS** - Estilização
- **Firebase Auth** - Autenticação
- **React Hooks** - Gerenciamento de estado

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados
- **CORS** - Política de cross-origin

### DevOps & Ferramentas
- **npm** - Gerenciador de pacotes
- **Git** - Controle de versão
- **VSCode** - Editor de código

## 🚀 Como Executar

### Pré-requisitos
- [Node.js 16+](https://nodejs.org/)
- [MySQL 8.0+](https://mysql.com/) (opcional)
- [Git](https://git-scm.com/)

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/seu-usuario/sistema-cafeteria.git
cd sistema-cafeteria
```

### 2️⃣ Instale as dependências
```bash
npm install
```

### 3️⃣ Configure o ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as variáveis conforme necessário
```

### 4️⃣ Inicie o backend
```bash
# Terminal 1 - API
node server-complete.js
```

### 5️⃣ Inicie o frontend
```bash
# Terminal 2 - React
npm start
```

### 6️⃣ Acesse o sistema
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

### 🎯 Executar com Script Automático
```bash
# Windows
iniciar.bat

# Ou duplo clique no arquivo iniciar.bat
```

## 📁 Estrutura do Projeto

```
sistema-cafeteria/
├── 📁 src/                          # Código React
│   ├── 📁 components/               # Componentes reutilizáveis
│   │   ├── 📁 Cart/                # Carrinho de compras
│   │   ├── 📁 Layout/              # Layout e navegação
│   │   ├── 📁 Orders/              # Histórico de pedidos
│   │   └── 📁 Payment/             # Sistema de pagamento
│   ├── 📁 pages/                   # Páginas principais
│   ├── 📁 services/                # Comunicação com API
│   └── 📁 utils/                   # Utilitários e constantes
├── 📁 database/                     # Scripts SQL
├── 📁 docs/                        # Documentação
├── 📄 server-complete.js           # API completa
├── 📄 package.json                 # Dependências
├── 📄 iniciar.bat                  # Script de inicialização
└── 📄 README.md                    # Este arquivo
```

## 🎨 Interface

### 🏠 Tela Principal
- Menu de produtos por categoria
- Busca inteligente
- Carrinho lateral
- Navegação responsiva

### 🛒 Carrinho e Pedidos
- Adição/remoção de itens
- Cálculo automático de totais
- Escolha de modalidade de entrega
- Sistema de pagamento integrado

### 📱 Responsivo
- Design mobile-first
- Adaptado para tablets e desktops
- Navegação otimizada para touch

## 💳 Sistema de Pagamento

### Modalidades Suportadas
- **PIX** 📱 - Código gerado automaticamente
- **Cartão** 💳 - Débito e crédito
- **Dinheiro** 💵 - Com cálculo de troco

### Tipos de Entrega
- **Local** 🍽️ - Consumir no estabelecimento
- **Delivery** 🚚 - Entrega em domicílio
- **Pickup** 🏃 - Retirada no balcão

## 📊 Banco de Dados

### Principais Tabelas
- `usuarios` - Dados dos clientes
- `produtos` - Catálogo de produtos
- `pedidos` - Pedidos realizados
- `reservas` - Reservas de mesa
- `pagamentos` - Transações financeiras

### Configuração MySQL
```sql
-- Execute o script de criação
source database/caffe_database.sql;

-- Ou use o arquivo individual
mysql -u root -p < database/caffe_database.sql
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=caffe_db

# Server
SERVER_PORT=3001
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:3001/api
```

### Firebase Setup
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication
3. Configure as credenciais em `src/utils/constants.js`

## 🧪 Modo de Desenvolvimento

### Com Banco MySQL
```bash
# 1. Configure MySQL e execute os scripts
# 2. Inicie com dados reais
node server.js
```

### Sem Banco (Mock)
```bash
# Inicie com dados simulados
node server-complete.js
```

### Usuário de Teste
- **ID**: 1
- **Nome**: Usuário de Teste
- **Email**: teste@caffe.com
- **Funciona**: Sem autenticação Firebase

## 📋 Roadmap

### ✅ Implementado
- [x] Sistema de pedidos completo
- [x] Carrinho de compras
- [x] Múltiplas formas de pagamento
- [x] Reserva de mesas
- [x] Histórico de pedidos
- [x] Interface responsiva

### 🔄 Em Desenvolvimento
- [ ] Notificações push
- [ ] Avaliações de produtos
- [ ] Sistema de cupons
- [ ] Chat de suporte

### 🎯 Futuras Melhorias
- [ ] App mobile nativo
- [ ] Integração com delivery
- [ ] Dashboard administrativo
- [ ] Relatórios avançados

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe de Desenvolvimento

- **Desenvolvedor Full Stack** - [Seu Nome](https://github.com/seu-usuario)
- **Orientador APS** - [Nome do Professor]

## 📞 Suporte

- 📧 Email: suporte@cafeteria.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: [cafeteria.com.br](https://cafeteria.com.br)

## 🎯 Status do Projeto

**🟢 Ativo** - Em desenvolvimento contínuo

---

<div align="center">

**[⬆ Voltar ao topo](#-sistema-de-cafeteria)**

Made with ☕ and ❤️ for APS

</div>
