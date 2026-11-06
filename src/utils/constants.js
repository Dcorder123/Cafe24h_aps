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
  ADMIN: 'admin',
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
  OUT_FOR_DELIVERY: 'Saiu para Entrega',
  DELIVERED: 'Finalizado',
  CANCELLED: 'Cancelado'
};

export const RESERVATION_STATUS = {
  PENDING: 'Aguardando Confirmação',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado'
};

// ponytail: autenticação rápida em frontend para demonstração acadêmica/APS, migrar para Firebase Auth Custom Claims em produção
export const ADMIN_PASSWORDS = [
  process.env.REACT_APP_ADMIN_PASSWORD || 'admin',
  'admin123',
  '1234'
];

// Configuração do Firebase
export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD8nolmjSg08cP_D9HLwJss6RoNAoaNeDM",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cafe-24h-portifolio.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "cafe-24h-portifolio",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cafe-24h-portifolio.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "631055718745",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:631055718745:web:d5fb8a14ab3a6314a91448"
};
