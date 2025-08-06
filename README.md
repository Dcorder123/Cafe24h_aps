# ☕ Cafe24h - Sistema de Cafeteria Completo

> Sistema web completo para gerenciamento de cafeteria desenvolvido para APS - Análise e Projeto de Sistemas

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql)](https://mysql.com/)

## 🎯 Sobre o Projeto

Sistema de cafeteria desenvolvido como projeto acadêmico para **APS (Atividade Prática Supervisionada)** do curso de **Engenharia da Computação** do **Instituto Federal da Paraíba (IFPB) - Campus Campina Grande**.

### 👥 Equipe de Desenvolvimento
- **Gustavo Henrique**
- **Daniel Barbosa** 
- **Danilo Lucena**

## ✨ Funcionalidades Principais

### 🛒 Para Clientes
- ✅ **Autenticação** - Cadastro e login seguro com Firebase
- ✅ **Cardápio Digital** - Navegação intuitiva por categorias
- ✅ **Carrinho Inteligente** - Persistência local e gestão automática
- ✅ **Pedidos Online** - Sistema completo de pedidos
- ✅ **Múltiplos Pagamentos** - PIX, Cartão e Dinheiro
- ✅ **Modalidades de Entrega** - Local, Delivery e Retirada
- ✅ **Reserva de Mesas** - Sistema de reservas integrado
- ✅ **Histórico Completo** - Acompanhamento de todos os pedidos

### 👨‍💼 Para Administradores
- ✅ **Dashboard Completo** - Visão geral do sistema
- ✅ **Gestão de Produtos** - CRUD completo
- ✅ **Controle de Pedidos** - Acompanhamento em tempo real
- ✅ **Relatórios** - Análise de vendas e performance

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** 18.2.0 - Interface de usuário
- **Tailwind CSS** - Estilização moderna
- **Firebase Auth** - Autenticação segura
- **React Router** - Navegação SPA

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados relacional
- **CORS** - Política de origem cruzada

### Ferramentas
- **Vite** - Build tool moderna
- **ESLint** - Linting de código
- **Git** - Controle de versão

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 16+ instalado
- MySQL 8.0+ configurado
- Git instalado

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/seu-usuario/Cafe24h_aps.git
cd Cafe24h_aps
```

### 2️⃣ Instale as Dependências
```bash
npm install
```

### 3️⃣ Configure o Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure as variáveis no arquivo .env
# - Dados do MySQL
# - Chaves do Firebase (opcional)
```

### 4️⃣ Configure o Banco de Dados
```bash
# Execute os scripts na pasta database/
# 1. schema.sql - Estrutura das tabelas
# 2. sample-data.sql - Dados de exemplo
```

### 5️⃣ Execute o Sistema

#### Terminal 1 - Backend API:
```bash
node server-complete.js
```

#### Terminal 2 - Frontend React:
```bash
npm start
```

### 6️⃣ Acesse o Sistema
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001

## 📁 Estrutura do Projeto

```
Cafe24h_aps/
├── 📁 src/                     # Frontend React
│   ├── 📁 components/          # Componentes reutilizáveis
│   ├── 📁 pages/              # Páginas da aplicação
│   ├── 📁 services/           # Serviços e APIs
│   ├── 📁 styles/             # Estilos CSS
│   └── 📄 App.js              # Componente principal
├── 📁 public/                  # Arquivos públicos
├── 📁 database/               # Scripts do banco de dados
├── 📁 projeto_diagramas_responsabilidade/  # Diagramas UML
├── 📄 server-complete.js      # Servidor Express
├── 📄 package.json           # Dependências do projeto
├── 📄 .env.example           # Variáveis de ambiente
└── 📄 README.md              # Este arquivo
```

## 🔄 Fluxos do Sistema

### 1. **Cadastro de Cliente**
Processo completo com validações, verificação de duplicidade e confirmação por email.

### 2. **Fazer Pedido**
Seleção de produtos, validação de estoque, cálculo de valores e envio para cozinha.

### 3. **Processar Pagamento**
Sistema multimodal supporting PIX (QR Code), cartão (validação online) e dinheiro (cálculo de troco).

### 4. **Solicitar Reserva**
Verificação de disponibilidade em tempo real e confirmação da reserva.

### 5. **Entrega do Pedido**
Coordenação final com notificação ao cliente e registro de métricas.

## 📊 Diagramas UML

O projeto inclui documentação completa com diagramas de responsabilidade:

- **Diagramas de Sequência** - Para cada fluxo principal
- **Casos de Uso** - Interações entre atores e sistema  
- **Modelo Conceitual** - Estrutura de dados e relacionamentos

### 🌐 Visualização Interativa
Acesse a interface interativa dos diagramas em: `projeto_diagramas_responsabilidade/src/index.html`

## 🐛 Solução de Problemas

### Erro de Autenticação
- Verifique se as chaves do Firebase estão configuradas corretamente
- O sistema funciona com usuário de teste se o Firebase não estiver configurado

### Erro de Conexão com Banco
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Execute os scripts da pasta `database/`

### Porta já em uso
- Frontend: Altere a porta no `package.json`
- Backend: Modifique a porta no `server-complete.js`

## 📈 Próximas Funcionalidades

- [ ] Sistema de notificações push
- [ ] Integração com delivery apps
- [ ] Dashboard de analytics avançado
- [ ] Sistema de fidelidade
- [ ] App mobile nativo

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

**Projeto desenvolvido para fins acadêmicos no IFPB - Campus Campina Grande**

- **Disciplina:** Análise e Projeto de Sistemas (APS)
- **Curso:** Engenharia da Computação
- **Ano:** 2025.1

---

### ⭐ Se este projeto te ajudou, deixe uma estrela!

**[⬆️ Voltar ao topo](#-cafe24h---sistema-de-cafeteria-completo)**
