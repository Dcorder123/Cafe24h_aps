import { useState, useEffect } from 'react';
import { CartService } from '../services/CartService';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartService] = useState(() => CartService.getInstance());

  useEffect(() => {
    // Observer para atualizar estado quando carrinho muda
    const observer = {
      update: (items) => setCartItems([...items])
    };

    cartService.addObserver(observer);
    setCartItems(cartService.getItems());

    return () => {
      cartService.removeObserver(observer);
    };
  }, [cartService]);

  const addItem = (product) => {
    cartService.addItem(product);
  };

  const removeItem = (productId) => {
    cartService.removeItem(productId);
  };

  const updateQuantity = (productId, quantity) => {
    cartService.updateQuantity(productId, quantity);
  };

  const clearCart = () => {
    cartService.clear();
  };

  const items = cartItems;
  const itemCount = cartService.getTotalItems();
  const total = cartService.getTotalValue();
  const isEmpty = cartService.isEmpty();

  return {
    items,
    itemCount,
    total,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
};
