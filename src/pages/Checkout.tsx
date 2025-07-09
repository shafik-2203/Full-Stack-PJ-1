import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, Clock } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
    phoneNumber: "",
  });
  const { items, totalAmount, placeOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to checkout</h2>
          <Link to="/login" className="text-orange-600 hover:text-orange-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link
            to="/restaurants"
            className="text-orange-600 hover:text-orange-700"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = 2.99;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const order = await placeOrder();
      if (order) {
        toast.success("Order placed successfully!");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Checkout Details</h2>

            {/* Delivery Address */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <MapPin size={18} />
                Delivery Address
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{user.username || user.name}</p>
                <p className="text-gray-600">123 Demo Street</p>
                <p className="text-gray-600">Demo City, DC 12345</p>
                <p className="text-gray-600">{user.mobile || user.phone}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <CreditCard size={18} />
                Payment Method
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setShowPaymentForm(true);
                    }}
                    className="mr-3"
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setShowPaymentForm(true);
                    }}
                    className="mr-3"
                  />
                  <span>UPI</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setShowPaymentForm(false);
                    }}
                    className="mr-3"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              {/* Payment Details Form */}
              {showPaymentForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Card Details
                      </h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.cardholderName}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              cardholderName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.cardNumber}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              cardNumber: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.expiryDate}
                            onChange={(e) =>
                              setPaymentDetails({
                                ...paymentDetails,
                                expiryDate: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.cvv}
                            onChange={(e) =>
                              setPaymentDetails({
                                ...paymentDetails,
                                cvv: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">UPI Details</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.upiId}
                          onChange={(e) =>
                            setPaymentDetails({
                              ...paymentDetails,
                              upiId: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="username@paytm"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Delivery Time */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Clock size={18} />
                Estimated Delivery
              </h3>
              <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">
                25-35 minutes
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
