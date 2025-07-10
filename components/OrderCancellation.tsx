import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  Coins,
  CreditCard,
} from "lucide-react";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  restaurant_id: string;
  confirmed_at?: string;
}

interface CancellationInfo {
  canCancel: boolean;
  charge: number;
  reason: string;
  timeRemaining?: number;
}

interface OrderCancellationProps {
  order: Order;
  onCancel: (orderId: string, refundMethod: string) => void;
  onClose: () => void;
}

export default function OrderCancellation({
  order,
  onCancel,
  onClose,
}: OrderCancellationProps) {
  const [cancellationInfo, setCancellationInfo] =
    useState<CancellationInfo | null>(null);
  const [refundMethod, setRefundMethod] = useState<"original" | "coins">(
    "original",
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCancellationInfo();
    const interval = setInterval(fetchCancellationInfo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [order.id]);

  useEffect(() => {
    if (cancellationInfo?.timeRemaining) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cancellationInfo]);

  const fetchCancellationInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/orders/${order.id}/cancellation-info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setCancellationInfo(data);
        setTimeRemaining(data.timeRemaining || 0);
      }
    } catch (error) {
      console.error("Error fetching cancellation info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancellationInfo?.canCancel) return;

    try {
      await onCancel(order.id, refundMethod);
      onClose();
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "preparing":
        return "text-orange-600 bg-orange-100";
      case "packed":
        return "text-purple-600 bg-purple-100";
      case "out_for_delivery":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRefundInfo = () => {
    if (!cancellationInfo) return null;

    const refundAmount = order.total_amount - cancellationInfo.charge;
    const coinsRefund = Math.floor(refundAmount * 0.5); // 50% as coins for faster processing

    return {
      refundAmount,
      coinsRefund,
      originalRefund: refundAmount,
    };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2">Loading cancellation details...</span>
          </div>
        </div>
      </div>
    );
  }

  const refundInfo = getRefundInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Cancel Order</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Order Status */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Order Status</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ₹{order.total_amount}
          </div>
        </div>

        {/* Cancellation Status */}
        <div className="p-6">
          {cancellationInfo?.canCancel ? (
            <div className="space-y-4">
              {/* Free Cancellation Timer */}
              {timeRemaining > 0 && cancellationInfo.charge === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      Free Cancellation
                    </span>
                  </div>
                  <div className="mt-2 text-green-700">
                    <div className="text-2xl font-bold">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-sm">
                      remaining for free cancellation
                    </div>
                  </div>
                </div>
              )}

              {/* Cancellation Charge */}
              {cancellationInfo.charge > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">
                      Cancellation Charge
                    </span>
                  </div>
                  <div className="text-yellow-700">
                    <div className="text-lg font-bold">
                      ₹{cancellationInfo.charge}
                    </div>
                    <div className="text-sm">{cancellationInfo.reason}</div>
                  </div>
                </div>
              )}

              {/* Refund Options */}
              {refundInfo && refundInfo.refundAmount > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Refund Options</h3>

                  {/* Original Payment Method */}
                  <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="refundMethod"
                      value="original"
                      checked={refundMethod === "original"}
                      onChange={(e) =>
                        setRefundMethod(e.target.value as "original")
                      }
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-medium">
                          Original Payment Method
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ₹{refundInfo.originalRefund} • Processing: 3-5 business
                        days
                      </div>
                    </div>
                  </label>

                  {/* FASTIO Coins */}
                  <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="refundMethod"
                      value="coins"
                      checked={refundMethod === "coins"}
                      onChange={(e) =>
                        setRefundMethod(e.target.value as "coins")
                      }
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Coins className="w-5 h-5 text-yellow-600 mr-2" />
                        <span className="font-medium">FASTIO Coins</span>
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Instant
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ₹{refundInfo.originalRefund} as coins • Use on next
                        order
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {/* Warning for No Refund */}
              {refundInfo && refundInfo.refundAmount === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">No Refund</span>
                  </div>
                  <div className="text-red-700 text-sm mt-1">
                    Full cancellation charge applies. No amount will be
                    refunded.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          ) : (
            /* Cannot Cancel */
            <div className="text-center space-y-4">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Cannot Cancel Order
                </h3>
                <p className="text-gray-600">{cancellationInfo?.reason}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
