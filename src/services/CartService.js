export class CartService {
  static instance = null;

  constructor() {
    if (CartService.instance) {
      return CartService.instance;
    }
    
    this.items = [];
    this.observers = [];
    CartService.instance = this;
  }

  static getInstance() {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  // Padrão Observer - Adicionar observador
  addObserver(observer) {
    this.observers.push(observer);
  }

  // Padrão Observer - Remover observador
  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  // Padrão Observer - Notificar observadores
  notifyObservers() {
    this.observers.forEach(observer => observer.update(this.items));
  }

  // Adicionar item ao carrinho
  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    
    this.notifyObservers();
  }

  // Atualizar quantidade de um item
  updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      this.notifyObservers();
    }
  }

  // Incrementar quantidade
  incrementQuantity(productId) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity += 1;
      this.notifyObservers();
    }
  }

  // Decrementar quantidade
  decrementQuantity(productId) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeItem(productId);
      }
      this.notifyObservers();
    }
  }

  // Remover item do carrinho
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.notifyObservers();
  }

  // Limpar carrinho
  clear() {
    this.items = [];
    this.notifyObservers();
  }

  // Obter todos os itens
  getItems() {
    return this.items;
  }

  // Obter total de itens
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Obter total do valor
  getTotalValue() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Verificar se o carrinho está vazio
  isEmpty() {
    return this.items.length === 0;
  }
}

export default CartService;
