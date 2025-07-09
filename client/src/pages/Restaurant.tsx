import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, Truck, MapPin, Plus, Minus } from "lucide-react";
import BackButton from "@/components/BackButton";
import { restaurants } from "@/data/restaurants";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function Restaurant() {
  const { id } = useParams();
  const { addItem, items, updateQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton to="/restaurants" />
        </div>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Restaurant Not Found
          </h1>
          <p className="text-gray-600">
            The restaurant you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const menuCategories = [
    "All",
    ...Array.from(new Set(restaurant.menu.map((item) => item.category))),
  ];

  const filteredMenu = restaurant.menu.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory,
  );

  const handleAddToCart = (item: any) => {
    addItem({
      _id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      isVegetarian: item.isVegetarian,
      isAvailable: true,
      restaurantId: restaurant.id,
    });
    toast.success(`${item.name} added to cart!`);
  };

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find((item) => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="mb-6 px-4 pt-6">
        <BackButton to="/restaurants" />
      </div>

      {/* Restaurant Header */}
      <div className="relative h-48 sm:h-64 mb-6 overflow-hidden rounded-lg shadow-lg">
        <img
          src={restaurant.coverImage}
          alt={`${restaurant.name} restaurant`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{restaurant.rating}</span>
              <span className="text-gray-300">({restaurant.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>{formatPrice(restaurant.deliveryFee)}</span>
            </div>
          </div>
        </div>
        {!restaurant.isOpen && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Closed
          </div>
        )}
      </div>

      <div className="container mx-auto px-4">
        {/* Restaurant Info */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <p className="text-gray-700 mb-4">{restaurant.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {restaurant.cuisines.map((cuisine) => (
              <span
                key={cuisine}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {cuisine}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {restaurant.location.address}, {restaurant.location.area}
            </span>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Minimum order: {formatPrice(restaurant.minimumOrder)}
          </div>
        </div>

        {/* Menu Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {menuCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredMenu.map((item) => {
            const quantity = getItemQuantity(item.id);
            return (
              <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 pr-2">
                        {item.name}
                        {item.isVegetarian && (
                          <span className="ml-2 text-green-600 text-sm">
                            🌱
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.preparationTime}
                        </span>
                      </div>
                      {quantity > 0 ? (
                        <div className="flex items-center gap-3 bg-primary-50 rounded-lg px-3 py-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, quantity - 1)
                            }
                            className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-primary-700 min-w-[20px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!restaurant.isOpen}
                          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
