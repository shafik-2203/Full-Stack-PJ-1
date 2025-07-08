import { useState, useMemo } from "react";
import { User, CartItem, ApiClient, Restaurant, Order } from "@/lib/types";
import { Search, Star, Clock, MapPin, Heart, Zap } from "lucide-react";
import BackButton from "@/components/BackButton";
import { restaurants, foodCategories } from "@/data/restaurants";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function RestaurantsEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState("all");
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId],
    );
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesCategory =
        selectedCategory === "All" ||
        restaurant.cuisines.some((cuisine) =>
          cuisine.toLowerCase().includes(selectedCategory.toLowerCase()),
        );

      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        restaurant.cuisines.some((cuisine) =>
          cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesPriceRange =
        priceRange === "all" ||
        (priceRange === "low" && restaurant.deliveryFee <= 2) ||
        (priceRange === "medium" &&
          restaurant.deliveryFee > 2 &&
          restaurant.deliveryFee <= 5) ||
        (priceRange === "high" && restaurant.deliveryFee > 5);

      const matchesVeg =
        !isVegOnly ||
        restaurant.cuisines.some((cuisine) =>
          cuisine.toLowerCase().includes("vegetarian"),
        );

      return (
        matchesCategory && matchesSearch && matchesPriceRange && matchesVeg
      );
    });
  }, [selectedCategory, searchQuery, priceRange, isVegOnly]);

  const sortedRestaurants = useMemo(() => {
    return [...filteredRestaurants].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "deliveryTime":
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case "deliveryFee":
          return a.deliveryFee - b.deliveryFee;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filteredRestaurants, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Premium Restaurants
          </h1>
          <p className="text-gray-600">
            Discover exceptional dining experiences with enhanced features
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="rating">Best Rated</option>
                <option value="deliveryTime">Fastest Delivery</option>
                <option value="deliveryFee">Lowest Delivery Fee</option>
                <option value="name">Alphabetical</option>
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Prices</option>
                <option value="low">$ (Under $2 delivery)</option>
                <option value="medium">$$ ($2-$5 delivery)</option>
                <option value="high">$$$ ($5+ delivery)</option>
              </select>

              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={isVegOnly}
                  onChange={(e) => setIsVegOnly(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Vegetarian Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categories
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {foodCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Stats */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {sortedRestaurants.length} of {restaurants.length} restaurants
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Zap className="w-4 h-4" />
            <span>Live updates</span>
          </div>
        </div>

        {/* Enhanced Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
            >
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(restaurant.id)}
                className="absolute top-4 left-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(restaurant.id)
                      ? "text-red-500 fill-current"
                      : "text-gray-600"
                  }`}
                />
              </button>

              <Link to={`/restaurant/${restaurant.id}`}>
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        restaurant.isOpen
                          ? "bg-green-500/90 text-white"
                          : "bg-red-500/90 text-white"
                      }`}
                    >
                      {restaurant.isOpen ? "Open Now" : "Closed"}
                    </span>
                  </div>
                  {restaurant.rating >= 4.5 && (
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                        Top Rated
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span className="text-gray-400">(200+)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {formatPrice(restaurant.deliveryFee)} delivery
                      </span>
                    </div>
                    <span>Min: {formatPrice(restaurant.minimumOrder)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.cuisines.slice(0, 3).map((cuisine, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {cuisine}
                      </span>
                    ))}
                    {restaurant.cuisines.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{restaurant.cuisines.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                      Order Now
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Menu
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {sortedRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setPriceRange("all");
                setIsVegOnly(false);
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
