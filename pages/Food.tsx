import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiClient } from "../lib/api";
import Logo from "../components/Logo";
import {
  Plus,
  Minus,
  Star,
  Clock,
  Truck,
  Search,
  Filter,
  X,
} from "lucide-react";

interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  restaurant: string;
  isAvailable: boolean;
  image?: string;
  isVeg?: boolean;
  rating?: number;
  preparationTime?: number;
}

export default function Food() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [allFoodItems, setAllFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceFilter, setPriceFilter] = useState<
    "all" | "under200" | "under500" | "above500"
  >("all");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "nonveg">("all");
  const [showFilters, setShowFilters] = useState(false);

  const { user, logout } = useAuth();
  const { totalItems, addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const debouncedSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      const currentScrollY = window.scrollY;
      applyFilters();
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollY);
      });
    }, 300);
  }, [searchQuery, selectedCategory, priceFilter, dietFilter]);

  useEffect(() => {
    debouncedSearch();

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedCategory, priceFilter, dietFilter]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);

      // Get all restaurants first
      const restaurantsResponse = await apiClient.getRestaurants();
      const allFoodItems: FoodItem[] = [];
      const categoriesSet = new Set<string>();

      if (restaurantsResponse.success && restaurantsResponse.data) {
        // Fetch menu items from each restaurant
        for (const restaurant of restaurantsResponse.data) {
          try {
            const menuResponse = await apiClient.getMenuByRestaurant(
              restaurant._id,
            );
            if (
              menuResponse.success &&
              menuResponse.data &&
              menuResponse.data.items
            ) {
              const restaurantItems = menuResponse.data.items.map(
                (item: any) => ({
                  _id: item._id,
                  name: item.name,
                  description: item.description,
                  price: item.price,
                  category: item.category,
                  restaurant: restaurant.name,
                  isAvailable: item.isAvailable,
                  image: item.image,
                  isVeg: item.isVeg,
                  rating: 4.0 + Math.random() * 1, // Mock rating
                  preparationTime: 15 + Math.floor(Math.random() * 25), // Mock prep time
                }),
              );
              allFoodItems.push(...restaurantItems);

              // Add categories
              restaurantItems.forEach((item: FoodItem) => {
                categoriesSet.add(item.category);
              });
            }
          } catch (error) {
            console.warn(`Failed to fetch menu for ${restaurant.name}:`, error);
          }
        }
      }

      setAllFoodItems(allFoodItems);
      setFoodItems(allFoodItems);
      setCategories(Array.from(categoriesSet));
    } catch (err) {
      setError("Failed to load food items");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    try {
      setError("");

      let filteredItems = [...allFoodItems];

      // Apply search query
      if (searchQuery.trim()) {
        filteredItems = filteredItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      // Apply category filter
      if (selectedCategory) {
        filteredItems = filteredItems.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory.toLowerCase(),
        );
      }

      // Apply price filter
      if (priceFilter !== "all") {
        switch (priceFilter) {
          case "under200":
            filteredItems = filteredItems.filter((item) => item.price < 200);
            break;
          case "under500":
            filteredItems = filteredItems.filter((item) => item.price < 500);
            break;
          case "above500":
            filteredItems = filteredItems.filter((item) => item.price >= 500);
            break;
        }
      }

      // Apply diet filter
      if (dietFilter !== "all") {
        if (dietFilter === "veg") {
          filteredItems = filteredItems.filter((item) => item.isVeg);
        } else if (dietFilter === "nonveg") {
          filteredItems = filteredItems.filter((item) => !item.isVeg);
        }
      }

      setFoodItems(filteredItems);
    } catch (err) {
      setError("Filter failed");
      console.error("Error filtering:", err);
    }
  };

  const handleAddToCart = (foodItem: FoodItem) => {
    const cartItem = {
      id: `${foodItem._id}-${Date.now()}`,
      menuItem: {
        id: foodItem._id,
        name: foodItem.name,
        description: foodItem.description,
        price: foodItem.price,
        image: foodItem.image,
      },
      quantity: 1,
      restaurantId: foodItem._id.split("-")[0] || "unknown",
      restaurantName: foodItem.restaurant,
    };

    addToCart(cartItem);
  };

  const getCartQuantity = (foodItemId: string) => {
    return cartItems.filter((item) => item.menuItem.id === foodItemId).length;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceFilter("all");
    setDietFilter("all");
    setFoodItems(allFoodItems);
  };

  if (isLoading && foodItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading delicious food...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600"
    >
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-20">
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
            <Link
              to="/restaurants"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Restaurants
            </Link>
            <Link to="/food" className="text-white font-semibold">
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
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Discover Delicious Food 🍽️
          </h2>
          <p className="text-white/90 text-lg">
            Browse individual dishes from all restaurants
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for dishes, restaurants, or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-0 bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white/90 text-gray-800 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Clear
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value as any)}
                    className="w-full p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="under200">Under ₹200</option>
                    <option value="under500">Under ₹500</option>
                    <option value="above500">₹500 & Above</option>
                  </select>
                </div>

                {/* Diet Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Diet
                  </label>
                  <select
                    value={dietFilter}
                    onChange={(e) => setDietFilter(e.target.value as any)}
                    className="w-full p-3 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All</option>
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Food Items Grid */}
        {foodItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto">
              <div className="text-white text-8xl mb-6">🍽️</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                No Food Items Found
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Try adjusting your search or filters to find delicious food!
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-100 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foodItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Food Image */}
                <div className="h-48 bg-gradient-to-r from-orange-200 to-orange-300 relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🍽️
                    </div>
                  )}

                  {/* Veg/Non-veg indicator */}
                  <div className="absolute top-3 left-3">
                    <div
                      className={`w-5 h-5 border-2 flex items-center justify-center ${
                        item.isVeg ? "border-green-500" : "border-red-500"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* Rating */}
                  {item.rating && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-current" />
                      {item.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Food Details */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">{item.restaurant}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-orange-500">
                      ₹{item.price}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {item.preparationTime}m
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                      {item.category}
                    </span>

                    {item.isAvailable ? (
                      <div className="flex items-center gap-2">
                        {getCartQuantity(item._id) > 0 && (
                          <span className="text-sm font-medium text-orange-600">
                            {getCartQuantity(item._id)} in cart
                          </span>
                        )}
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-red-500 font-medium">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-8 text-center">
          <p className="text-white/80">
            Showing {foodItems.length} food items
            {(searchQuery ||
              selectedCategory ||
              priceFilter !== "all" ||
              dietFilter !== "all") &&
              ` matching your filters`}
          </p>
        </div>
      </main>
    </div>
  );
}
