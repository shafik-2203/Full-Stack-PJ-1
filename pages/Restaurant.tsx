import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiClient } from "../lib/api";
import { Restaurant as RestaurantType, MenuItem } from "@shared/api";
import Logo from "../components/Logo";

export default function Restaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addItem, totalItems } = useCart();

  const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setIsLoading(true);
      setError(""); // Clear previous errors

      console.log(`🔍 Fetching restaurant data for ID: ${id}`);

      const [restaurantResponse, menuResponse] = await Promise.all([
        apiClient.getRestaurant(id!),
        apiClient.getMenuItems(id!),
      ]);

      console.log("Restaurant Response:", restaurantResponse);
      console.log("Menu Response:", menuResponse);

      if (restaurantResponse.success && restaurantResponse.data) {
        setRestaurant(restaurantResponse.data);
        console.log("✅ Restaurant data loaded successfully");
      } else {
        console.warn("⚠️ Restaurant data not available");
        setError("Restaurant data not available");
      }

      if (menuResponse.success && menuResponse.data) {
        // Handle both formats: direct items array or data.items structure
        const items = menuResponse.data.items || menuResponse.data || [];
        setMenuItems(Array.isArray(items) ? items : []);
        console.log(`✅ Menu items loaded: ${items.length} items`);
      } else {
        console.warn("⚠️ Menu data not available");
        setMenuItems([]);
      }
    } catch (err) {
      console.error("Error fetching restaurant data:", err);
      // If we have mock data, try to use it
      try {
        const mockRestaurants = [
          {
            _id: "mock1",
            name: "Pizza Palace",
            description: "Authentic Italian pizzas",
            rating: 4.5,
            deliveryTime: "25-35 min",
            deliveryFee: 49,
            minimumOrder: 199,
          },
          {
            _id: "mock2",
            name: "Burger Hub",
            description: "Gourmet burgers and fries",
            rating: 4.2,
            deliveryTime: "20-30 min",
            deliveryFee: 29,
            minimumOrder: 149,
          },
          {
            _id: "mock3",
            name: "Sushi Express",
            description: "Fresh sushi and Japanese cuisine",
            rating: 4.7,
            deliveryTime: "30-40 min",
            deliveryFee: 59,
            minimumOrder: 299,
          },
          {
            _id: "mock4",
            name: "Spice Garden",
            description: "Traditional Indian cuisine",
            rating: 4.6,
            deliveryTime: "35-45 min",
            deliveryFee: 39,
            minimumOrder: 249,
          },
        ];
        const mockRestaurant = mockRestaurants.find((r) => r._id === id);
        if (mockRestaurant) {
          setRestaurant(mockRestaurant as any);
          console.log(
            "🎭 Using mock restaurant data for:",
            mockRestaurant.name,
          );
          setError(""); // Clear error since we have mock data
        } else {
          setError("Restaurant not found in mock data");
        }
      } catch {
        setError("Failed to load restaurant data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    if (restaurant) {
      const restaurantId = (restaurant as any)._id || restaurant.id;
      addItem(menuItem, restaurantId, restaurant.name);
      // Show success feedback
      alert(`${menuItem.name} added to cart!`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const categories = [...new Set(menuItems.map((item) => item.category))];
  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading restaurant...</div>
      </div>
    );
  }

  // Only show error if no restaurant data AND there's a real error (not just network issues)
  if (
    !restaurant &&
    error &&
    !error.includes("offline") &&
    !error.includes("network")
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Restaurant not found</div>
          <div className="text-white/80 mb-4">{error}</div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-white text-orange-500 rounded-lg hover:bg-orange-100 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
              className="text-white hover:text-orange-200 transition-colors flex items-center gap-2"
            >
              Cart
              {totalItems > 0 && (
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {totalItems}
                </span>
              )}
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
        {/* Restaurant Info */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
          <div className="h-64 bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center overflow-hidden relative">
            {(restaurant as any).image ? (
              <img
                src={(restaurant as any).image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`absolute inset-0 text-white text-8xl ${(restaurant as any).image ? "hidden" : "flex"} items-center justify-center`}
            >
              🍽️
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {restaurant.name}
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              {restaurant.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-gray-700 font-semibold text-lg">
                  {restaurant.rating}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-xl">🕒</span>
                <span className="text-gray-700">{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">🚚</span>
                <span className="text-gray-700">
                  ${restaurant.deliveryFee} delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500 text-xl">💰</span>
                <span className="text-gray-700">
                  Min: ${restaurant.minimumOrder}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Menu Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-6 py-3 rounded-full transition-all ${
                selectedCategory === ""
                  ? "bg-white text-orange-500"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-white text-orange-500"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={(item as any)._id || item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="h-48 bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`text-white text-4xl ${item.image ? "hidden" : "flex"} items-center justify-center w-full h-full`}
                >
                  🍽️
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <span className="text-2xl font-bold text-orange-500">
                    ${item.price}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </span>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No menu items found
            </h3>
            <p className="text-white/80">Try selecting a different category</p>
          </div>
        )}

        {/* Floating Cart Button */}
        {totalItems > 0 && (
          <Link
            to="/cart"
            className="fixed bottom-6 right-6 bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-all z-50"
          >
            <div className="relative">
              <span className="text-2xl">🛒</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {totalItems}
              </span>
            </div>
          </Link>
        )}
      </main>
    </div>
  );
}
