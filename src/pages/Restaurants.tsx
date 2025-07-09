import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Star, Clock, Truck, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { restaurantsData } from "../data/restaurants";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState(restaurantsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const cuisines = [
    "All",
    "Italian",
    "American",
    "Japanese",
    "Mexican",
    "Thai",
    "Healthy",
  ];

  const filteredRestaurants = restaurants
    .filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.some((c) =>
          c.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
    .filter(
      (restaurant) =>
        selectedCuisine === "" ||
        selectedCuisine === "All" ||
        restaurant.cuisine.includes(selectedCuisine),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "deliveryTime":
          return a.deliveryTime.min - b.deliveryTime.min;
        case "deliveryFee":
          return a.deliveryFee - b.deliveryFee;
        default:
          return 0;
      }
    });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view restaurants
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                🛒 Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Cuisine Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {cuisines.map((cuisine) => (
                  <option
                    key={cuisine}
                    value={cuisine === "All" ? "" : cuisine}
                  >
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm font-medium">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="rating">Rating</option>
                <option value="deliveryTime">Delivery Time</option>
                <option value="deliveryFee">Delivery Fee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredRestaurants.length} restaurant
            {filteredRestaurants.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Restaurant Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No restaurants found</p>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover:scale-[1.02]"
              >
                {/* Restaurant Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {restaurant.isVerified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Verified
                    </div>
                  )}
                </div>

                {/* Restaurant Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {restaurant.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({restaurant.totalReviews})
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {restaurant.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {restaurant.cuisine.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {restaurant.deliveryTime.min}-
                        {restaurant.deliveryTime.max} min
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      <span>${restaurant.deliveryFee}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Minimum order: ${restaurant.minimumOrder}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
