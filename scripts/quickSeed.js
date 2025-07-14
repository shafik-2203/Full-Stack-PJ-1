const API_BASE = "https://fullstack-pj1-bd.onrender.com";

const sampleRestaurants = [
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

const sampleMenuItems = [
  // Pizza Palace items
  {
    name: "Margherita Pizza",
    description: "Classic tomato, mozzarella, and basil",
    price: 299,
    category: "Pizza",
    isAvailable: true,
    restaurantIndex: 0,
  },
  {
    name: "Pepperoni Pizza",
    description: "Pepperoni with mozzarella cheese",
    price: 399,
    category: "Pizza",
    isAvailable: true,
    restaurantIndex: 0,
  },
  // Burger Hub items
  {
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, onion",
    price: 249,
    category: "Burger",
    isAvailable: true,
    restaurantIndex: 1,
  },
  {
    name: "French Fries",
    description: "Crispy golden fries",
    price: 99,
    category: "Snacks",
    isAvailable: true,
    restaurantIndex: 1,
  },
  // Sushi Express items
  {
    name: "California Roll",
    description: "Crab, avocado, cucumber",
    price: 399,
    category: "Sushi",
    isAvailable: true,
    restaurantIndex: 2,
  },
  {
    name: "Miso Soup",
    description: "Traditional soybean soup",
    price: 149,
    category: "Soup",
    isAvailable: true,
    restaurantIndex: 2,
  },
  // Spice Garden items
  {
    name: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken",
    price: 349,
    category: "Main Course",
    isAvailable: true,
    restaurantIndex: 3,
  },
  {
    name: "Biryani",
    description: "Aromatic basmati rice with spices and meat",
    price: 299,
    category: "Rice",
    isAvailable: true,
    restaurantIndex: 3,
  },
];

async function seedProduction() {
  try {
    console.log("🌱 Starting production seed...");

    // Create admin user
    console.log("👤 Creating admin user...");
    const adminSignup = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        email: "fastio121299@gmail.com",
        password: "fastio1212",
        mobile: "9999999999",
      }),
    });

    const adminData = await adminSignup.json();
    console.log("Admin signup result:", adminData);

    // Create test user
    console.log("👤 Creating test user...");
    const userSignup = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "mohamedshafik",
        email: "mohamedshafik2526@gmail.com",
        password: "Shafik1212@",
        mobile: "8888888888",
      }),
    });

    const userData = await userSignup.json();
    console.log("User signup result:", userData);

    console.log("✅ Production seed complete! Check remote database.");
    console.log("👤 Admin: fastio121299@gmail.com / fastio1212");
    console.log("👤 User: mohamedshafik2526@gmail.com / Shafik1212@");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  }
}

// Run if called directly
if (typeof window === "undefined") {
  seedProduction();
}

export { seedProduction, sampleRestaurants, sampleMenuItems };
