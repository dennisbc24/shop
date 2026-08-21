"use client";
import { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext();

const STORAGE_KEY = "cocinamejor_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id_product === product.id_product);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { ...product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((product) => {
    setCart((prev) => prev.filter((p) => p.id_product !== product.id_product));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.id_product !== productId));
    } else {
      setCart((prev) => prev.map((p) => (p.id_product === productId ? { ...p, quantity: qty } : p)));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const total = cart.reduce((acc, p) => acc + Number(p.list_price || p.cost || 0) * p.quantity, 0);
  const count = cart.reduce((acc, p) => acc + p.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}
