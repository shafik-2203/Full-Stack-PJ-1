import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../lib/api";
import type { MenuItem, Order } from "../types";
import { toast } from "sonner";

export interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  restaurantId?: string;
  isVegetarian?: boolean;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  restaurantId: string | null;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: () => Promise<Order | null>;
  trackOrder: (orderId: string) => Promise<Order | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("fastio_cart");
      const savedRestaurantId = localStorage.getItem("fastio_cart_restaurant");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
      if (savedRestaurantId) {
        setRestaurantId(savedRestaurantId);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      localStorage.removeItem("fastio_cart");
      localStorage.removeItem("fastio_cart_restaurant");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("fastio_cart", JSON.stringify(items));
      if (restaurantId) {
        localStorage.setItem("fastio_cart_restaurant", restaurantId);
      } else {
        localStorage.removeItem("fastio_cart_restaurant");
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items, restaurantId]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const addItem = (item: MenuItem) => {
    if (restaurantId && restaurantId !== item.restaurantId) {
      toast.error("You can only order from one restaurant at a time.", {
        action: {
          label: "Clear Cart",
          onClick: () => clearCart(),
        },
      });
      return;
    }

    const cartItem: CartItem = {
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      restaurantId: item.restaurantId,
      isVegetarian: item.isVegetarian,
      quantity: 1,
    };

    setItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === item._id);
      if (existing) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      } else {
        return [...prevItems, cartItem];
      }
    });
    setRestaurantId(item.restaurantId || null);
  };

  const removeItem = (itemId: string) => {
    const newItems = items.filter((item) => item._id !== itemId);
    setItems(newItems);
    if (newItems.length === 0) setRestaurantId(null);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      setItems(items.map((i) => (i._id === itemId ? { ...i, quantity } : i)));
    }
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    localStorage.removeItem("fastio_cart");
    localStorage.removeItem("fastio_cart_restaurant");
  };

  const placeOrder = async (): Promise<Order | null> => {
    try {
      // Simulate order placement for demo
      const mockOrder: Order = {
        _id: "order_" + Date.now(),
        orderId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        user: {
          _id: "user_1",
          name: "Demo User",
          email: "demo@fastio.com",
        },
        restaurant: {
          _id: "rest_1",
          name: "Demo Restaurant",
        },
        items: items.map((item) => ({
          foodItem: {
            _id: item._id,
            name: item.name,
          },
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: totalAmount,
        tax: totalAmount * 0.08,
        deliveryFee: 2.99,
        total: totalAmount + totalAmount * 0.08 + 2.99,
        status: "Pending",
        paymentStatus: "Pending",
        paymentMethod: "Card",
        deliveryAddress: {
          street: "123 Demo Street",
          city: "Demo City",
          state: "Demo State",
          zipCode: "12345",
          phone: "555-123-4567",
        },
        createdAt: new Date().toISOString(),
      };

      clearCart();
      toast.success("Order placed successfully!");
      return mockOrder;
    } catch (error: any) {
      toast.error("Failed to place order");
      return null;
    }
  };

  const trackOrder = async (orderId: string): Promise<Order | null> => {
    try {
      // Simulate order tracking for demo
      const mockOrder: Order = {
        _id: orderId,
        orderId: orderId,
        user: {
          _id: "user_1",
          name: "Demo User",
          email: "demo@fastio.com",
        },
        restaurant: {
          _id: "rest_1",
          name: "Demo Restaurant",
        },
        items: [],
        subtotal: 25.99,
        tax: 2.08,
        deliveryFee: 2.99,
        total: 31.06,
        status: "Preparing",
        paymentStatus: "Completed",
        paymentMethod: "Card",
        deliveryAddress: {
          street: "123 Demo Street",
          city: "Demo City",
          state: "Demo State",
          zipCode: "12345",
          phone: "555-123-4567",
        },
        createdAt: new Date().toISOString(),
      };
      return mockOrder;
    } catch (error: any) {
      toast.error("Unable to track order");
      return null;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        restaurantId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        placeOrder,
        trackOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
