
import React, { useState } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  estimatedDelivery: string;
}

export default function TrackOrder() {
  const { token } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    if (!orderId.trim()) return toast.error("Please enter an order ID");
    setLoading(true);
    try {
      const res = await apiClient.get(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-lg shadow bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Track Your Order</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="border p-2 flex-1 rounded"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={fetchOrder}
          disabled={loading}
        >
          {loading ? "Loading..." : "Track"}
        </button>
      </div>

      {order && (
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span className="text-blue-600">{order.status}</span>
          </div>
          <div>
            <span className="font-semibold">Order Date:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Estimated Delivery:</span>{" "}
            {new Date(order.estimatedDelivery).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Total Amount:</span> ₹{order.totalAmount}
          </div>

          <div>
            <h2 className="font-semibold mt-4 mb-2">Items:</h2>
            <ul className="border-t divide-y">
              {order.items.map((item, index) => (
                <li key={index} className="py-2 flex justify-between">
                  <div>{item.name} x {item.quantity}</div>
                  <div>₹{item.price * item.quantity}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
