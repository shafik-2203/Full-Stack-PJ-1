import { useState } from "react";

const mockRestaurants = [
  {
    name: "Pizza Palace",
    description: "Authentic Italian pizzas made with fresh ingredients",
    category: "Italian",
    rating: 4.5,
    deliveryTime: "25-35 min",
    deliveryFee: 49,
    minimumOrder: 199,
    isActive: true,
  },
  {
    name: "Burger Hub",
    description: "Gourmet burgers and crispy fries",
    category: "American",
    rating: 4.2,
    deliveryTime: "20-30 min",
    deliveryFee: 29,
    minimumOrder: 149,
    isActive: true,
  },
  {
    name: "Sushi Express",
    description: "Fresh sushi and Japanese cuisine",
    category: "Japanese",
    rating: 4.7,
    deliveryTime: "30-40 min",
    deliveryFee: 59,
    minimumOrder: 299,
    isActive: true,
  },
  {
    name: "Spice Garden",
    description: "Traditional Indian cuisine with authentic flavors",
    category: "Indian",
    rating: 4.6,
    deliveryTime: "35-45 min",
    deliveryFee: 39,
    minimumOrder: 249,
    isActive: true,
  },
];

export default function TempSeed() {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [isLoading, setIsLoading] = useState(false);

  // For now, just use the mock data
  const handleSeed = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Mock restaurants loaded:", restaurants);
      setIsLoading(false);
      alert("Mock restaurant data is ready for display!");
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-orange-500 text-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Temp Seed Data</h3>
      <p className="text-sm mb-3">{restaurants.length} restaurants ready</p>
      <button
        onClick={handleSeed}
        disabled={isLoading}
        className="bg-white text-orange-500 px-3 py-1 rounded font-medium hover:bg-gray-100 disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Use Mock Data"}
      </button>
    </div>
  );
}

export { mockRestaurants };
