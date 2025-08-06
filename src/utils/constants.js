// Constantes da aplicação - Caffe
export const APP_NAME = 'Caffe';

export const PAGES = {
  LOGIN: 'login',
  MENU: 'menu',
  CART: 'cart',
  HISTORY: 'history',
  RESERVATION: 'reservation',
  ACCOUNT: 'account'
};

export const CATEGORIES = {
  ALL: 'all',
  COFFEE: 'coffee',
  TEA: 'tea',
  SNACKS: 'snacks',
  SWEETS: 'sweets',
  DRINKS: 'drinks'
};

export const DELIVERY_MODES = ['Retirada', 'Entrega', 'No Local'];
export const PAYMENT_METHODS = ['PIX', 'Cartão'];

export const ORDER_STATUS = {
  PENDING: 'Aguardando Confirmação',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado'
};

export const RESERVATION_STATUS = {
  PENDING: 'Aguardando Confirmação',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado'
};

// Configuração do Firebase
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCspKtOl4VdZ_N6w-x2VFuKyoLz0MoT0WQ",
  authDomain: "cafeteria-cc62b.firebaseapp.com",
  projectId: "cafeteria-cc62b",
  storageBucket: "cafeteria-cc62b.firebasestorage.app",
  messagingSenderId: "1078259055056",
  appId: "1:1078259055056:web:16f5b93b23e8b2b9b31fef"
};
