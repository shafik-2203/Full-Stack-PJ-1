import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiClient } from "../lib/api";
import { paymentMethods, paymentService, PaymentDetails } from "../lib/payment";
import Logo from "../components/Logo";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items, totalItems, totalAmount, clearCart } = useCart();

  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.username || "",
    email: user?.email || "",
    phone: user?.mobile || "",
  });
  const [billingAddress, setBillingAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "IN",
  });
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Reset errors
    setError("");
    setFieldErrors({});

    // Validate customer information
    if (!customerInfo.name.trim()) {
      errors.customerName = "Full name is required";
    }
    if (!customerInfo.email.trim()) {
      errors.customerEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.customerEmail = "Please enter a valid email address";
    }
    if (!customerInfo.phone.trim()) {
      errors.customerPhone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(customerInfo.phone)) {
      errors.customerPhone = "Please enter a valid phone number";
    }

    // Validate delivery address
    if (!deliveryAddress.trim()) {
      errors.deliveryAddress = "Delivery address is required";
    } else if (deliveryAddress.trim().length < 10) {
      errors.deliveryAddress =
        "Please provide a detailed address (minimum 10 characters)";
    }

    // Validate payment method
    if (!selectedPayment) {
      errors.paymentMethod = "Please select a payment method";
    }

    // Validate payment method specific fields
    if (selectedPayment === "stripe_card") {
      if (!cardDetails.number.trim()) {
        errors.cardNumber = "Card number is required";
      }
      if (!cardDetails.expiry.trim()) {
        errors.cardExpiry = "Expiry date is required";
      }
      if (!cardDetails.cvc.trim()) {
        errors.cardCvc = "CVC is required";
      }
      if (!cardDetails.name.trim()) {
        errors.cardName = "Cardholder name is required";
      }
    }

    if (selectedPayment === "upi" && !upiId.trim()) {
      errors.upiId = "UPI ID is required";
    }

    if (selectedPayment === "bank_transfer") {
      if (!billingAddress.line1.trim()) {
        errors.billingLine1 = "Address line is required";
      }
      if (!billingAddress.city.trim()) {
        errors.billingCity = "City is required";
      }
      if (!billingAddress.state.trim()) {
        errors.billingState = "State is required";
      }
      if (!billingAddress.postal_code.trim()) {
        errors.billingPostal = "Postal code is required";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }

    return true;
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPayment(methodId);
    setShowPaymentForm(methodId !== "cash_on_delivery");
    setError("");
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Process payment first (except for cash on delivery)
      let paymentResult = { success: true, paymentId: "cod_pending" };

      if (selectedPayment !== "cash_on_delivery") {
        const deliveryFee = 2.99;
        const tax = totalAmount * 0.08;
        const finalTotal = totalAmount + deliveryFee + tax;

        const paymentDetails: PaymentDetails = {
          amount: finalTotal,
          currency: "INR",
          paymentMethodId: selectedPayment,
          customerInfo,
          billingAddress,
        };

        paymentResult = await paymentService.processPayment(paymentDetails);

        if (!paymentResult.success) {
          setError(paymentResult.error || "Payment failed");
          setIsProcessing(false);
          return;
        }
      }

      // Create order after successful payment
      const orderData = {
        restaurantId: items[0]?.restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          price: item.menuItem.price,
          name: item.menuItem.name,
        })),
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod: selectedPayment,
      };

      const response = await apiClient.createOrder(orderData);

      if (response.success) {
        // Clear cart
        clearCart();

        // Show success message with payment ID
        const successMessage =
          selectedPayment === "cash_on_delivery"
            ? "Order placed successfully! Pay cash upon delivery."
            : `Payment successful! Transaction ID: ${paymentResult.paymentId}`;

        alert(successMessage);

        // Navigate to orders page
        navigate("/orders");
      } else {
        setError(response.message || "Failed to place order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const restaurantName = items[0]?.restaurantName || "Restaurant";
  const deliveryFee = 2.99;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + deliveryFee + tax;

  const selectedMethod = paymentMethods.find((m) => m.id === selectedPayment);

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size={60} />
            <h1 className="text-2xl font-bold text-white">FASTIO</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/cart"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Cart ({totalItems})
            </Link>
            <Link
              to="/orders"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Orders
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {user?.username}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-orange-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Secure Checkout
            </h1>
            <p className="text-white/80 text-lg">
              Complete your order with real-time payment processing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => {
                        setCustomerInfo({
                          ...customerInfo,
                          name: e.target.value,
                        });
                        if (fieldErrors.customerName) {
                          setFieldErrors({ ...fieldErrors, customerName: "" });
                        }
                      }}
                      className={`w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.customerName ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter your full name"
                      required
                    />
                    {fieldErrors.customerName && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.customerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => {
                        setCustomerInfo({
                          ...customerInfo,
                          email: e.target.value,
                        });
                        if (fieldErrors.customerEmail) {
                          setFieldErrors({ ...fieldErrors, customerEmail: "" });
                        }
                      }}
                      className={`w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.customerEmail ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter your email address"
                      required
                    />
                    {fieldErrors.customerEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.customerEmail}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => {
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        });
                        if (fieldErrors.customerPhone) {
                          setFieldErrors({ ...fieldErrors, customerPhone: "" });
                        }
                      }}
                      className={`w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.customerPhone ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter your phone number"
                      required
                    />
                    {fieldErrors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldErrors.customerPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Delivery Address
                </h2>
                <label className="block text-gray-700 font-medium mb-2">
                  Complete Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => {
                    setDeliveryAddress(e.target.value);
                    if (fieldErrors.deliveryAddress) {
                      setFieldErrors({ ...fieldErrors, deliveryAddress: "" });
                    }
                  }}
                  placeholder="Enter your complete delivery address with landmarks..."
                  className={`w-full p-4 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none ${fieldErrors.deliveryAddress ? "border-red-500" : "border-gray-300"}`}
                  rows={3}
                  required
                />
                {fieldErrors.deliveryAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.deliveryAddress}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${!method.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) =>
                          handlePaymentMethodSelect(e.target.value)
                        }
                        disabled={!method.enabled}
                        className="mr-4 h-4 w-4 text-orange-500"
                      />
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <div>
                        <span className="font-medium text-gray-800">
                          {method.name}
                        </span>
                        {method.type === "digital_wallet" && (
                          <span className="block text-sm text-gray-500">
                            Instant payment
                          </span>
                        )}
                        {method.type === "bank_transfer" && (
                          <span className="block text-sm text-gray-500">
                            2-3 business days
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Payment Details Form */}
                {showPaymentForm && selectedMethod && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">
                      {selectedMethod.name} Details
                    </h3>

                    {selectedPayment === "stripe_card" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                number: e.target.value,
                              })
                            }
                            className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                            maxLength={19}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Expiry *
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) =>
                                setCardDetails({
                                  ...cardDetails,
                                  expiry: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              CVC *
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              value={cardDetails.cvc}
                              onChange={(e) =>
                                setCardDetails({
                                  ...cardDetails,
                                  cvc: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPayment === "upi" && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          UPI ID *
                        </label>
                        <input
                          type="text"
                          placeholder="yourname@paytm / yourname@phonepe"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          Enter your UPI ID (PhonePe, Google Pay, Paytm, etc.)
                        </p>
                      </div>
                    )}

                    {selectedPayment === "bank_transfer" && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">
                            Bank Transfer Details
                          </h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            <p>
                              <strong>Account Name:</strong> FASTIO Private
                              Limited
                            </p>
                            <p>
                              <strong>Account Number:</strong> 1234567890
                            </p>
                            <p>
                              <strong>IFSC Code:</strong> FAST0001234
                            </p>
                            <p>
                              <strong>Bank:</strong> FASTIO Bank, Main Branch
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Your Address *
                          </label>
                          <input
                            type="text"
                            placeholder="Street address"
                            value={billingAddress.line1}
                            onChange={(e) =>
                              setBillingAddress({
                                ...billingAddress,
                                line1: e.target.value,
                              })
                            }
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 mb-2"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="City"
                              value={billingAddress.city}
                              onChange={(e) =>
                                setBillingAddress({
                                  ...billingAddress,
                                  city: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={billingAddress.state}
                              onChange={(e) =>
                                setBillingAddress({
                                  ...billingAddress,
                                  state: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                {/* Restaurant Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">
                    From {restaurantName}
                  </h3>
                  <p className="text-gray-600 text-sm">{totalItems} items</p>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.quantity}x</span>{" "}
                        {item.menuItem.name}
                      </div>
                      <span>
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">
                      ${deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold text-orange-500">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure Payment Badge */}
                <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-lg">🔒</span>
                    <span className="text-sm font-medium">
                      Secure Payment Processing
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Your payment information is encrypted and secure
                  </p>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Processing Payment..."
                    : `${selectedPayment === "cash_on_delivery" ? "Place Order" : "Pay"} - ₹${finalTotal.toFixed(2)}`}
                </button>

                <Link
                  to="/cart"
                  className="block w-full text-center mt-4 text-orange-500 hover:text-orange-700 transition-colors"
                >
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
