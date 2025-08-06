const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // Métodos para produtos
  async getProducts(categoria = null) {
    const params = categoria ? `?categoria=${categoria}` : '';
    return this.request(`/products${params}`);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  // Métodos para categorias
  async getCategories() {
    return this.request('/categories');
  }

  // Métodos para usuários
  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserByUid(uid) {
    return this.request(`/users/${uid}`);
  }

  async updateUser(uid, userData) {
    return this.request(`/users/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Métodos para pedidos
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrdersByUser(userId) {
    return this.request(`/orders/user/${userId}`);
  }

  async getOrderById(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Métodos para reservas
  async createReservation(reservationData) {
    return this.request('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  }

  async getReservationsByUser(userId) {
    return this.request(`/reservations/user/${userId}`);
  }

  async getAvailableTables(date, time, guests) {
    return this.request(`/tables/available?date=${date}&time=${time}&guests=${guests}`);
  }

  // Métodos para notificações
  async getUserNotifications(userId, limit = 10) {
    return this.request(`/notifications/user/${userId}?limit=${limit}`);
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  // Métodos para relatórios
  async getSalesReport(startDate, endDate) {
    return this.request(`/reports/sales?startDate=${startDate}&endDate=${endDate}`);
  }

  async getTopProducts(limit = 10) {
    return this.request(`/reports/top-products?limit=${limit}`);
  }

  async getTableStatus() {
    return this.request('/tables/status');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Criar instância singleton
const apiService = new ApiService();

export default apiService;
