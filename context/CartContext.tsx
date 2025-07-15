import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@shared/api";

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (
    menuItem: MenuItem,
    restaurantId: string,
    restaurantName: string,
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getRestaurantId: () => string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("fastio_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("fastio_cart");
      }
    }
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    localStorage.setItem("fastio_cart", JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );

  const addItem = (
    menuItem: MenuItem,
    restaurantId: string,
    restaurantName: string,
  ) => {
    setItems((prevItems) => {
      // Check if cart has items from different restaurant
      if (prevItems.length > 0 && prevItems[0].restaurantId !== restaurantId) {
        // Clear cart and add new item from different restaurant
        const newItem: CartItem = {
          id: `${menuItem._id || menuItem.id}_${Date.now()}`,
          menuItem,
          quantity: 1,
          restaurantId,
          restaurantName,
        };
        return [newItem];
      }

      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          (item.menuItem._id || item.menuItem.id) ===
          (menuItem._id || menuItem.id),
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: `${menuItem._id || menuItem.id}_${Date.now()}`,
          menuItem,
          quantity: 1,
          restaurantId,
          restaurantName,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getRestaurantId = () => {
    return items.length > 0 ? items[0].restaurantId : null;
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getRestaurantId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
