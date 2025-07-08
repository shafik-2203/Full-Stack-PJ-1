// Real-time features for FASTIO - Zepto/Zomato-like experience

interface OrderUpdate {
  orderId: string;
  status: string;
  estimatedTime?: number;
  message?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  location: {
    lat: number;
    lng: number;
  };
  vehicle: string;
}

class RealTimeService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private callbacks: Map<string, Function[]> = new Map();

  constructor() {
    this.connect();
  }

  // Connect to WebSocket for real-time updates
  connect() {
    // Temporarily disable WebSocket connection until server WebSocket is implemented
    console.log(
      "🔄 Real-time service initialized (WebSocket disabled until server implementation)",
    );

    // Use polling fallback instead
    this.startPolling();

    // Emit connected event for compatibility
    this.emit("connected", false);

    // TODO: Implement WebSocket server endpoint at /ws
    // try {
    //   const wsUrl =
    //     window.location.protocol === "https:"
    //       ? `wss://${window.location.host}/ws`
    //       : `ws://${window.location.host}/ws`;
    //   this.ws = new WebSocket(wsUrl);
    //   // ... WebSocket setup code
    // } catch (error) {
    //   console.error("Failed to establish WebSocket connection:", error);
    //   this.startPolling();
    // }
  }

  // Handle incoming messages
  private handleMessage(data: any) {
    const { type, payload } = data;

    switch (type) {
      case "order_update":
        this.emit("orderUpdate", payload as OrderUpdate);
        break;
      case "delivery_partner_assigned":
        this.emit("deliveryPartnerAssigned", payload as DeliveryPartner);
        break;
      case "delivery_location_update":
        this.emit("deliveryLocationUpdate", payload);
        break;
      case "restaurant_busy":
        this.emit("restaurantBusy", payload);
        break;
      case "promotion_alert":
        this.emit("promotionAlert", payload);
        break;
      default:
        console.log("Unknown message type:", type);
    }
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback: Function) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit events to subscribers
  private emit(event: string, data: any) {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Send message to server
  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  }

  // Attempt to reconnect
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      setTimeout(
        () => {
          this.connect();
        },
        Math.pow(2, this.reconnectAttempts) * 1000,
      ); // Exponential backoff
    } else {
      console.log(
        "🚫 Max reconnection attempts reached, falling back to polling",
      );
      this.startPolling();
    }
  }

  // Fallback polling for real-time-like updates
  private startPolling() {
    // Temporarily disable polling until server endpoints are implemented
    console.log(
      "📡 Real-time polling disabled until server endpoints are ready",
    );

    // TODO: Implement /api/orders/updates endpoint on server
    // setInterval(() => {
    //   this.pollForUpdates();
    // }, 5000);
  }

  private async pollForUpdates() {
    // Disabled until server endpoint is implemented
    console.log("📡 Polling disabled - implement /api/orders/updates endpoint");

    // try {
    //   const token = localStorage.getItem("fastio_token");
    //   if (!token) return;
    //
    //   const response = await fetch("/api/orders/updates", {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //
    //   if (response.ok) {
    //     const updates = await response.json();
    //     if (updates.data && updates.data.length > 0) {
    //       updates.data.forEach((update: OrderUpdate) => {
    //         this.emit("orderUpdate", update);
    //       });
    //     }
    //   }
    // } catch (error) {
    //   console.error("Polling error:", error);
    // }
  }

  // Track order in real-time
  trackOrder(orderId: string) {
    this.send("track_order", { orderId });
  }

  // Subscribe to delivery partner location updates
  subscribeToDeliveryTracking(orderId: string) {
    this.send("subscribe_delivery_tracking", { orderId });
  }

  // Get real-time restaurant availability
  checkRestaurantAvailability(restaurantId: string) {
    this.send("check_restaurant_availability", { restaurantId });
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Export singleton instance
export const realTimeService = new RealTimeService();

// Utility functions for real-time features
export const showOrderNotification = (update: OrderUpdate) => {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification("FASTIO Order Update", {
      body: update.message || `Your order status: ${update.status}`,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-32x32.png",
    });

    notification.onclick = () => {
      window.open("/orders", "_blank");
      notification.close();
    };

    setTimeout(() => notification.close(), 5000);
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

// Estimate delivery time based on distance and current load
export const estimateDeliveryTime = (
  distance: number,
  restaurantLoad: number = 1,
): number => {
  const baseTime = 20; // 20 minutes base time
  const distanceTime = distance * 2; // 2 minutes per km
  const loadMultiplier = Math.min(restaurantLoad * 0.5, 2); // Max 2x multiplier

  return Math.round(baseTime + distanceTime + baseTime * loadMultiplier);
};

// Format time for display
export const formatEstimatedTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins}m`;
};