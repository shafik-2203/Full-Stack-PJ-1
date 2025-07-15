import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiClient } from "../lib/api";
import { Restaurant } from "@shared/api";
import Logo from "../components/Logo";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    [],
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const { user, logout } = useAuth();

  const fetchRestaurants = async () => {
    try {
      const res = await apiClient.getRestaurants();
      if (res.success) {
        setRestaurants(res.data || []);
        setFilteredRestaurants(res.data || []);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load restaurants", err);
      setError("Failed to load restaurants.");
      setIsLoading(false);
    }
  };

  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [restaurants, selectedCategory, sortBy]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [restaurantsResponse, categoriesResponse] = await Promise.all([
        apiClient.getRestaurants(),
        apiClient.getCategories(),
      ]);

      if (restaurantsResponse.success) {
        setRestaurants(restaurantsResponse.data || []);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      }
    } catch (err) {
      setError("Failed to load restaurants");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...restaurants];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "delivery_time":
          const aTime = parseInt(a.deliveryTime.match(/(\d+)/)?.[1] || "0");
          const bTime = parseInt(b.deliveryTime.match(/(\d+)/)?.[1] || "0");
          return aTime - bTime;
        case "price_asc":
          return a.minimumOrder - b.minimumOrder;
        case "price_desc":
          return b.minimumOrder - a.minimumOrder;
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading restaurants...</div>
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
              Dashboard
            </Link>
            <Link to="/restaurants" className="text-white font-semibold">
              Restaurants
            </Link>
            <Link
              to="/food"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Food
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
            <span className="text-white hidden md:block">
              Welcome, {user?.username}!
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-orange-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            🍽️ Browse Restaurants
          </h2>
          <p className="text-white/90 text-lg">
            Discover amazing restaurants and cuisines near you
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <h3 className="text-xl font-semibold text-white">Filter & Sort</h3>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-white/30 bg-white rounded-full text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="rating">Most Popular</option>
                <option value="delivery_time">Fastest Delivery</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-white font-medium mb-3">Categories</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === ""
                    ? "bg-white text-orange-500"
                    : "bg-white/30 text-white hover:bg-white/50"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? "bg-white text-orange-500"
                      : "bg-white/30 text-white hover:bg-white/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-white/80 text-lg">
            {filteredRestaurants.length} restaurant
            {filteredRestaurants.length !== 1 ? "s" : ""} found
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant, index) => (
            <Link
              key={restaurant._id || restaurant.id || index}
              to={`/restaurants/${restaurant._id || restaurant.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="h-48 bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center relative">
                <div className="text-white text-6xl">🍽️</div>
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm">
                  {restaurant.deliveryTime}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {restaurant.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-gray-700 font-medium">
                      {restaurant.rating}
                    </span>
                  </div>
                  <span className="text-orange-500 font-semibold">
                    ${restaurant.deliveryFee} delivery
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    Min: ${restaurant.minimumOrder}
                  </span>
                  <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                    {restaurant.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredRestaurants.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-white text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No restaurants found
            </h3>
            <p className="text-white/80 mb-4">
              {selectedCategory
                ? `No restaurants found in the ${selectedCategory} category`
                : "Try adjusting your filters"}
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="px-6 py-3 bg-white text-orange-500 rounded-full hover:bg-orange-100 transition-all"
              >
                Show All Restaurants
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
