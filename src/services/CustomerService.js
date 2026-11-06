// Serviço de gestão de clientes e persistência local por número de celular

const STORAGE_KEY_CURRENT = 'cafe24h_user';
const STORAGE_KEY_DIRECTORY = 'cafe24h_customers_by_phone';

export const CustomerService = {
  // Obter usuário atual da sessão
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (raw) return JSON.parse(raw);
    } catch { }
    return {
      isAnonymous: true,
      name: '',
      email: '',
      phone: '',
      address: '',
      number: '',
      preferences: { notifications: true }
    };
  },

  // Salvar/atualizar usuário atual e cadastrar no catálogo por telefone
  saveUser(userData) {
    try {
      const cleanData = {
        ...userData,
        isAnonymous: false
      };
      // Salva sessão atual
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(cleanData));

      // Se tiver telefone com pelo menos 10 dígitos, cadastra no índice por telefone
      const digits = (cleanData.phone || '').replace(/\D/g, '');
      if (digits.length >= 10) {
        const directory = this.getDirectory();
        directory[digits] = cleanData;
        localStorage.setItem(STORAGE_KEY_DIRECTORY, JSON.stringify(directory));
      }
      return cleanData;
    } catch (e) {
      console.error('Erro ao salvar dados do cliente:', e);
      return userData;
    }
  },

  // Buscar cliente por número de celular (qualquer formato com dígitos)
  findByPhone(phoneInput) {
    if (!phoneInput) return null;
    const digits = String(phoneInput).replace(/\D/g, '');
    if (digits.length < 10) return null;
    const directory = this.getDirectory();
    return directory[digits] || null;
  },

  // Realizar login com celular (carrega dados se existirem e restaura a sessão)
  loginWithPhone(phoneInput) {
    const customer = this.findByPhone(phoneInput);
    if (customer) {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(customer));
      return customer;
    }
    return null;
  },

  // Encerrar sessão atual
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
    } catch { }
  },

  // Obter mapa completo de clientes salvos localmente
  getDirectory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DIRECTORY);
      if (raw) return JSON.parse(raw);
    } catch { }
    return {};
  }
};

