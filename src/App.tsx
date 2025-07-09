import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Enhanced FastIO Homepage
function SimpleHome() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 text-center text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left flex items-center gap-3">
            <img src="/fastio-icon.svg" alt="FastIO Logo" className="w-8 h-8" />
            <div>
              <div className="text-lg font-semibold">FASTIO</div>
              <div className="text-sm opacity-80">Food Delivery</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Current Time</div>
            <div className="text-lg font-semibold">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/fastio-icon.svg"
              alt="FastIO Logo"
              className="w-20 h-20 animate-pulse"
            />
            <h1 className="text-7xl font-bold animate-pulse">FASTIO</h1>
          </div>
          <h2 className="text-4xl font-bold mb-4">Fast Food Delivery</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Delicious food from your favorite restaurants, delivered fast to
            your door! Order now and enjoy amazing meals in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg">
              🚀 Order Now
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-500 transition-all transform hover:scale-105">
              📱 Download App
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-2xl font-semibold mb-4">Browse Restaurants</h3>
            <p className="opacity-90">
              Discover amazing local restaurants and cuisines near you
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold mb-4">Easy Ordering</h3>
            <p className="opacity-90">
              Simple and fast ordering process with secure payments
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
            <p className="opacity-90">
              Quick delivery tracking and real-time updates
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-sm opacity-80">Restaurants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">10k+</div>
            <div className="text-sm opacity-80">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">30min</div>
            <div className="text-sm opacity-80">Avg Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm opacity-80">Available</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center opacity-80">
          <p>© 2024 FastIO Food Delivery. Made with ❤️ by Mohamed Shafik</p>
        </div>
      </div>
    </div>
  );
}

function SimpleLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      alert(`Welcome back! Logging in with ${email}`);
      // You can add actual login logic here
    } else {
      alert("Please enter both email and password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/fastio-icon.svg"
              alt="FastIO Logo"
              className="w-10 h-10"
            />
            <h1 className="text-3xl font-bold text-orange-600">FASTIO</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white p-3 rounded-lg font-semibold hover:bg-orange-600 transform hover:scale-105 transition-all shadow-lg"
          >
            Sign In 🚀
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button className="text-orange-500 font-semibold hover:text-orange-600">
                Sign up now
              </button>
            </p>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-500 text-center">
              Demo Credentials:
            </p>
            <div className="text-xs text-gray-400 text-center mt-2">
              <div>Admin: fastio121299@gmail.com / fastio1212</div>
              <div>User: mohamedshafik2526@gmail.com / Shafik1212@</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SimpleHome />} />
      <Route path="/login" element={<SimpleLogin />} />
      <Route path="*" element={<SimpleHome />} />
    </Routes>
  );
}

export default App;
