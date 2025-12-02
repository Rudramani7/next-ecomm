"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children, initialItems = [] }) {
  const [items, setItems] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("cart");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (err) {
        console.warn("Cart load failed:", err);
      }
    }
    return Array.isArray(initialItems) ? initialItems : [];
  });

  useEffect(() => {
    try {
      const serialized = JSON.stringify(items);
      localStorage.setItem("cart", serialized);

      document.cookie = `cart=${encodeURIComponent(
        serialized
      )}; path=/; max-age=604800`;
    } catch (err) {
      console.warn("Cart persist failed:", err);
    }
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }

      return [...prev, { id: product.id, product, quantity }];
    });
  };

  const updateProduct = (id, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const deleteFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    items,
    addToCart,
    updateProduct,
    deleteFromCart,
    itemsCount: totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
