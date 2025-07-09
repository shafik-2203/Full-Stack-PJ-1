import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Clock, Truck, ArrowLeft, Plus } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { getRestaurantById } from "../data/restaurants";
import { toast } from "sonner";

export default function Restaurant() {
  const { id } = useParams();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view restaurant details
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

  const restaurant = getRestaurantById(id || "1");

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Restaurant not found
          </h2>
          <Link
            to="/restaurants"
            className="text-orange-600 hover:text-orange-700"
          >
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const categories = [...new Set(restaurant.menu.map((item) => item.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Restaurants</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
            </div>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              🛒 Cart
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Hero */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            {restaurant.isVerified && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ✓ Verified
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-gray-600 mb-3">{restaurant.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.cuisine.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-lg font-semibold text-gray-900">
                    {restaurant.rating}
                  </span>
                  <span className="text-gray-600">
                    ({restaurant.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {restaurant.deliveryTime.min}-{restaurant.deliveryTime.max}{" "}
                  min delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>${restaurant.deliveryFee} delivery fee</span>
              </div>
              <div>
                <span>Minimum order: ${restaurant.minimumOrder}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Menu</h3>
          </div>
          <div className="p-6">
            {categories.map((category) => (
              <div key={category} className="mb-8 last:mb-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {restaurant.menu
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-gray-900">
                              {item.name}
                              {item.isVegetarian && (
                                <span className="ml-2 text-green-600">🌱</span>
                              )}
                            </h5>
                            <span className="font-semibold text-orange-600">
                              ${item.price}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.description}
                          </p>
                          <button
                            onClick={() => {
                              const itemToAdd: any = {
                                _id: item._id,
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                image: item.image,
                                category: item.category,
                                restaurantId: restaurant._id,
                                isVegetarian: item.isVegetarian,
                              };
                              addItem(itemToAdd);
                              toast.success(`${item.name} added to cart! 🛒`, {
                                description: `$${item.price.toFixed(2)} • ${restaurant.name}`,
                                action: {
                                  label: "View Cart",
                                  onClick: () =>
                                    (window.location.href = "/cart"),
                                },
                              });
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            <Plus size={16} />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
