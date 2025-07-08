import BackButton from "@/components/BackButton";

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Mock cart data
  const cartItems = [
    { id: 1, name: "Margherita Pizza", price: 299, quantity: 2 },
    { id: 2, name: "Chicken Burger", price: 199, quantity: 1 },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = 49;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryFee + taxes;

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, RuPay",
    },
    {
      id: "upi",
      name: "UPI",
      icon: Smartphone,
      description: "PhonePe, GPay, Paytm",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: Wallet,
      description: "Paytm, Amazon Pay",
    },
  ];

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      toast.error("Please enter delivery address");
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("🎉 Order placed successfully!");
    setIsProcessing(false);
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton to="/cart" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8 animate-fade-in">
          🛒 Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Delivery Address
              </h2>
              <textarea
                placeholder="Enter your complete delivery address..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-none"
                rows={3}
              />
              <input
                type="tel"
                placeholder="Phone number for delivery"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full mt-3 p-4 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
              />
            </div>

            {/* Payment Methods */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Payment Method
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedPayment === method.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent
                          className={`w-6 h-6 ${
                            selectedPayment === method.id
                              ? "text-orange-500"
                              : "text-gray-400"
                          }`}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {method.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedPayment === method.id
                              ? "border-orange-500 bg-orange-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === method.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Details Form (shown when card is selected) */}
              {selectedPayment === "card" && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Card Details
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number (1234 5678 9012 3456)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                    />
                  </div>
                </div>
              )}

              {/* UPI Details Form (shown when UPI is selected) */}
              {selectedPayment === "upi" && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
                  <h3 className="font-medium text-gray-900 mb-3">
                    UPI Details
                  </h3>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (example@paytm)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                  />
                </div>
              )}
            </div>

            {/* Transaction Security */}
            <div
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    🔒 Secure Transaction
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your payment is protected with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total}</span>
                </div>
              </div>
            </div>

            {/* Delivery Time */}
            <div
              className="bg-white rounded-xl shadow-sm p-6 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">
                  ⚡ Delivery Time
                </h3>
              </div>
              <p className="text-2xl font-bold text-orange-600">25-30 mins</p>
              <p className="text-sm text-gray-600">Estimated delivery time</p>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing Payment...
                </div>
              ) : (
                `🛒 Place Order - ₹${total}`
              )}
            </button>

            {/* Trust Badges */}
            <div
              className="text-center space-y-2 animate-fade-in"
              style={{ animationDelay: "0.7s" }}
            >
              <p className="text-sm text-gray-500">
                Trusted by 10,000+ customers
              </p>
              <div className="flex justify-center gap-4 text-xs text-gray-400">
                <span>🔒 SSL Secured</span>
                <span>💳 PCI Compliant</span>
                <span>⚡ Fast Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}