import React, { createContext, useContext, useState, useEffect } from "react";
import type { MenuItem } from "@/lib/api";

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  restaurantId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("fastio_cart");
    const savedRestaurantId = localStorage.getItem("fastio_cart_restaurant");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }

    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fastio_cart", JSON.stringify(items));
    if (restaurantId) {
      localStorage.setItem("fastio_cart_restaurant", restaurantId);
    } else {
      localStorage.removeItem("fastio_cart_restaurant");
    }
  }, [items, restaurantId]);

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const addItem = (item: MenuItem) => {
    // If adding item from different restaurant, clear cart first
    if (restaurantId && restaurantId !== item.restaurantId) {
      const shouldClearCart = window.confirm(
        "Adding items from a different restaurant will clear your current cart. Continue?",
      );
      if (!shouldClearCart) return;
      setItems([]);
    }

    setRestaurantId(item.restaurantId);

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem._id === item._id,
      );

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item._id !== itemId);
      if (newItems.length === 0) {
        setRestaurantId(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    localStorage.removeItem("fastio_cart");
    localStorage.removeItem("fastio_cart_restaurant");
  };

  const value = {
    items,
    totalAmount,
    totalItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    restaurantId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
