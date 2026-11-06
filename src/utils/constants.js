// Constantes da aplicação - Caffe
export const APP_NAME = 'Caffe';

export const PAGES = {
  LOGIN: 'login',
  MENU: 'menu',
  CART: 'cart',
  HISTORY: 'history',
  RESERVATION: 'reservation',
  ACCOUNT: 'account',
  PRIVACY: 'privacy',
  NOT_FOUND: 'not_found'
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
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCspKtOl4VdZ_N6w-x2VFuKyoLz0MoT0WQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cafeteria-cc62b.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "cafeteria-cc62b",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cafeteria-cc62b.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1078259055056",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1078259055056:web:16f5b93b23e8b2b9b31fef"
};
