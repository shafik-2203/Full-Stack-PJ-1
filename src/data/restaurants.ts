export interface RestaurantData {
  _id: string;
  name: string;
  cuisine: string[];
  rating: number;
  totalReviews: number;
  deliveryTime: { min: number; max: number };
  deliveryFee: number;
  minimumOrder: number;
  image: string;
  description: string;
  isVerified: boolean;
  address: string;
  phone: string;
  menu: MenuItem[];
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVegetarian: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: string;
  preparationTime?: number;
  rating?: number;
  totalOrders?: number;
  emoji?: string;
}

export const restaurantsData: RestaurantData[] = [
  {
    _id: "1",
    name: "Pizza Palace",
    cuisine: ["Italian", "Pizza"],
    rating: 4.5,
    totalReviews: 120,
    deliveryTime: { min: 25, max: 35 },
    deliveryFee: 2.99,
    minimumOrder: 15,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop",
    description: "Authentic Italian pizzas with fresh ingredients",
    isVerified: true,
    address: "123 Pizza Street, Food City",
    phone: "(555) 123-4567",
    menu: [
      {
        _id: "pizza_1",
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, and basil",
        price: 16.99,
        category: "Pizza",
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop",
        isVegetarian: true,
        emoji: "🍕",
        rating: 4.8,
        totalOrders: 1205,
      },
      {
        _id: "pizza_2",
        name: "Pepperoni Pizza",
        description: "Classic pepperoni with mozzarella cheese",
        price: 18.99,
        category: "Pizza",
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop",
        isVegetarian: false,
        emoji: "🍕",
        rating: 4.7,
        totalOrders: 1890,
      },
      {
        _id: "pizza_3",
        name: "Quattro Stagioni",
        description:
          "Four seasons pizza with mushrooms, ham, artichokes, and olives",
        price: 22.99,
        category: "Pizza",
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
        isVegetarian: false,
        emoji: "🍕",
        rating: 4.6,
        totalOrders: 723,
      },
      {
        _id: "pizza_4",
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with caesar dressing and croutons",
        price: 12.99,
        category: "Salads",
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
        isVegetarian: true,
        emoji: "🥗",
        rating: 4.4,
        totalOrders: 456,
      },
      {
        _id: "pizza_5",
        name: "Garlic Bread",
        description: "Toasted bread with garlic butter and herbs",
        price: 7.99,
        category: "Appetizers",
        image:
          "https://images.unsplash.com/photo-1573140401552-388c8b6cabb3?w=300&h=200&fit=crop",
        isVegetarian: true,
        emoji: "🥖",
        rating: 4.3,
        totalOrders: 892,
      },
    ],
  },
  {
    _id: "2",
    name: "Burger Junction",
    cuisine: ["American", "Burgers"],
    rating: 4.2,
    totalReviews: 89,
    deliveryTime: { min: 20, max: 30 },
    deliveryFee: 1.99,
    minimumOrder: 12,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
    description: "Juicy burgers and crispy fries",
    isVerified: true,
    address: "456 Burger Ave, Food City",
    phone: "(555) 234-5678",
    menu: [
      {
        _id: "burger_1",
        name: "Classic Cheeseburger",
        description:
          "Beef patty with cheddar cheese, lettuce, tomato, and pickles",
        price: 14.99,
        category: "Burgers",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
        isVegetarian: false,
        emoji: "🍔",
        rating: 4.5,
        totalOrders: 2341,
      },
      {
        _id: "burger_2",
        name: "Bacon BBQ Burger",
        description: "Double beef patty with bacon, BBQ sauce, and onion rings",
        price: 18.99,
        category: "Burgers",
        image:
          "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&h=200&fit=crop",
        isVegetarian: false,
        emoji: "🍔",
        rating: 4.7,
        totalOrders: 1876,
      },
      {
        _id: "burger_3",
        name: "Veggie Burger",
        description: "Plant-based patty with avocado, lettuce, and vegan mayo",
        price: 16.99,
        category: "Burgers",
        image:
          "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&h=200&fit=crop",
        isVegetarian: true,
        isVegan: true,
        emoji: "🍔",
        rating: 4.3,
        totalOrders: 567,
      },
      {
        _id: "burger_4",
        name: "Crispy Fries",
        description: "Golden crispy french fries with sea salt",
        price: 6.99,
        category: "Sides",
        image:
          "https://images.unsplash.com/photo-1576107316049-54a7ddd833c9?w=300&h=200&fit=crop",
        isVegetarian: true,
        emoji: "🍟",
        rating: 4.6,
        totalOrders: 3456,
      },
      {
        _id: "burger_5",
        name: "Chocolate Shake",
        description: "Rich chocolate milkshake with whipped cream",
        price: 5.99,
        category: "Beverages",
        image:
          "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop",
        isVegetarian: true,
        emoji: "🥤",
        rating: 4.4,
        totalOrders: 1234,
      },
    ],
  },
  {
    _id: "3",
    name: "Sushi Zen",
    cuisine: ["Japanese", "Sushi"],
    rating: 4.7,
    totalReviews: 156,
    deliveryTime: { min: 30, max: 45 },
    deliveryFee: 3.99,
    minimumOrder: 25,
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop",
    description: "Fresh sushi and Japanese delicacies",
    isVerified: true,
    address: "789 Sushi Lane, Food City",
    phone: "(555) 345-6789",
    menu: [
      {
        _id: "sushi_1",
        name: "California Roll",
        description: "Crab, avocado, and cucumber wrapped in nori and rice",
        price: 12.99,
        category: "Sushi Rolls",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
        isVegetarian: false,
        emoji: "🍣",
        rating: 4.8,
        totalOrders: 1567,
      },
      {
        _id: "sushi_2",
        name: "Salmon Nigiri",
        description: "Fresh salmon over seasoned sushi rice (2 pieces)",
        price: 8.99,
        category: "Nigiri",
        image:
          "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop",
        isVegetarian: false,
        emoji: "🍣",
        rating: 4.9,
        totalOrders: 2234,
      },
      {
        _id: "sushi_3",
        name: "Dragon Roll",
        description: "Eel and cucumber topped with avocado and eel sauce",
        price: 18.99,
        category: "Specialty Rolls",
        image:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?w=300&h=200&fit=crop",
        isVegetarian: false,
        emoji: "🍣",
        rating: 4.7,
        totalOrders: 892,
      },
      {
        _id: "sushi_4",
        name: "Miso Soup",
        description: "Traditional Japanese soup with tofu and seaweed",
        price: 4.99,
        category: "Soups",
        image:
          "https://images.unsplash.com/photo-1606850196854-d13cdec95358?w=300&h=200&fit=crop",
        isVegetarian: true,
        emoji: "🍲",
        rating: 4.6,
        totalOrders: 1789,
      },
      {
        _id: "sushi_5",
        name: "Tempura Vegetables",
        description: "Lightly battered and fried seasonal vegetables",
        price: 14.99,
        category: "Tempura",
        image:
          "https://images.unsplash.com/photo-1541057670-9b5b78ed7853?w=300&h=200&fit=crop",
        isVegetarian: true,
        emoji: "🍤",
        rating: 4.5,
        totalOrders: 678,
      },
    ],
  },
  {
    _id: "4",
    name: "Taco Fiesta",
    cuisine: ["Mexican", "Tacos"],
    rating: 4.3,
    totalReviews: 94,
    deliveryTime: { min: 15, max: 25 },
    deliveryFee: 2.49,
    minimumOrder: 10,
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=300&fit=crop",
    description: "Authentic Mexican tacos and burritos",
    isVerified: true,
    address: "321 Taco Street, Food City",
    phone: "(555) 456-7890",
    menu: [
      {
        _id: "taco_1",
        name: "Carnitas Tacos",
        description:
          "Slow-cooked pork with onions, cilantro, and lime (3 tacos)",
        price: 11.99,
        category: "Tacos",
        image:
          "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop",
        isVegetarian: false,
        spiceLevel: "Medium",
        emoji: "🌮",
        rating: 4.6,
        totalOrders: 1890,
      },
      {
        _id: "taco_2",
        name: "Fish Tacos",
        description:
          "Grilled fish with cabbage slaw and chipotle mayo (3 tacos)",
        price: 13.99,
        category: "Tacos",
        image:
          "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop",
        isVegetarian: false,
        spiceLevel: "Mild",
        emoji: "🌮",
        rating: 4.4,
        totalOrders: 1234,
      },
      {
        _id: "taco_3",
        name: "Veggie Burrito Bowl",
        description: "Black beans, rice, guacamole, salsa, and vegetables",
        price: 12.99,
        category: "Bowls",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
        isVegetarian: true,
        isVegan: true,
        emoji: "🥙",
        rating: 4.5,
        totalOrders: 987,
      },
      {
        _id: "taco_4",
        name: "Chicken Quesadilla",
        description: "Grilled chicken and cheese in a crispy tortilla",
        price: 10.99,
        category: "Quesadillas",
        image:
          "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=300&h=200&fit=crop",
        isVegetarian: false,
        emoji: "🫓",
        rating: 4.3,
        totalOrders: 1567,
      },
      {
        _id: "taco_5",
        name: "Guacamole & Chips",
        description: "Fresh made guacamole with crispy tortilla chips",
        price: 7.99,
        category: "Appetizers",
        image:
          "https://images.unsplash.com/photo-1541905349827-1b11b13b8f83?w=300&h=200&fit=crop",
        isVegetarian: true,
        isVegan: true,
        emoji: "🥑",
        rating: 4.7,
        totalOrders: 2345,
      },
    ],
  },
  {
    _id: "5",
    name: "Thai Garden",
    cuisine: ["Thai", "Asian"],
    rating: 4.4,
    totalReviews: 78,
    deliveryTime: { min: 25, max: 40 },
    deliveryFee: 3.49,
    minimumOrder: 18,
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop",
    description: "Spicy and flavorful Thai cuisine",
    isVerified: true,
    address: "654 Thai Way, Food City",
    phone: "(555) 567-8901",
    menu: [
      {
        _id: "thai_1",
        name: "Pad Thai",
        description:
          "Stir-fried rice noodles with shrimp, bean sprouts, and peanuts",
        price: 15.99,
        category: "Noodles",
        image:
          "https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&h=200&fit=crop",
        isVegetarian: false,
        spiceLevel: "Medium",
        emoji: "🍜",
        rating: 4.6,
        totalOrders: 1456,
      },
      {
        _id: "thai_2",
        name: "Green Curry",
        description: "Coconut curry with vegetables and choice of protein",
        price: 17.99,
        category: "Curries",
        image:
          "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop",
        isVegetarian: true,
        spiceLevel: "Hot",
        emoji: "🍛",
        rating: 4.8,
        totalOrders: 1234,
      },
      {
        _id: "thai_3",
        name: "Tom Yum Soup",
        description: "Spicy and sour soup with lemongrass and lime leaves",
        price: 12.99,
        category: "Soups",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop",
        isVegetarian: true,
        spiceLevel: "Hot",
        emoji: "🍲",
        rating: 4.5,
        totalOrders: 891,
      },
      {
        _id: "thai_4",
        name: "Mango Sticky Rice",
        description: "Sweet sticky rice with fresh mango and coconut milk",
        price: 8.99,
        category: "Desserts",
        image:
          "https://images.unsplash.com/photo-1624432203834-12c74e8b5e8e?w=300&h=200&fit=crop",
        isVegetarian: true,
        emoji: "🥭",
        rating: 4.7,
        totalOrders: 567,
      },
      {
        _id: "thai_5",
        name: "Spring Rolls",
        description: "Fresh vegetables wrapped in rice paper with peanut sauce",
        price: 9.99,
        category: "Appetizers",
        image:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop",
        isVegetarian: true,
        isVegan: true,
        emoji: "🥬",
        rating: 4.4,
        totalOrders: 678,
      },
    ],
  },
  {
    _id: "6",
    name: "Healthy Bowls",
    cuisine: ["Healthy", "Salads"],
    rating: 4.6,
    totalReviews: 112,
    deliveryTime: { min: 20, max: 30 },
    deliveryFee: 2.99,
    minimumOrder: 14,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
    description: "Fresh, healthy bowls and salads",
    isVerified: true,
    address: "987 Health Street, Food City",
    phone: "(555) 678-9012",
    menu: [
      {
        _id: "healthy_1",
        name: "Quinoa Power Bowl",
        description:
          "Quinoa with roasted vegetables, avocado, and tahini dressing",
        price: 14.99,
        category: "Power Bowls",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        emoji: "🥗",
        rating: 4.8,
        totalOrders: 1345,
      },
      {
        _id: "healthy_2",
        name: "Grilled Chicken Salad",
        description:
          "Mixed greens with grilled chicken, cherry tomatoes, and balsamic",
        price: 16.99,
        category: "Salads",
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
        isVegetarian: false,
        isGlutenFree: true,
        emoji: "🥗",
        rating: 4.6,
        totalOrders: 2134,
      },
      {
        _id: "healthy_3",
        name: "Acai Bowl",
        description: "Acai blend topped with granola, berries, and honey",
        price: 12.99,
        category: "Smoothie Bowls",
        image:
          "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=300&h=200&fit=crop",
        isVegetarian: true,
        emoji: "🍓",
        rating: 4.7,
        totalOrders: 987,
      },
      {
        _id: "healthy_4",
        name: "Green Smoothie",
        description: "Spinach, banana, mango, and coconut water blend",
        price: 7.99,
        category: "Smoothies",
        image:
          "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=200&fit=crop",
        isVegetarian: true,
        isVegan: true,
        emoji: "🥤",
        rating: 4.4,
        totalOrders: 1567,
      },
      {
        _id: "healthy_5",
        name: "Protein Energy Balls",
        description: "Date and nut energy balls with protein powder (6 pieces)",
        price: 9.99,
        category: "Snacks",
        image:
          "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&h=200&fit=crop",
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        emoji: "🍪",
        rating: 4.5,
        totalOrders: 678,
      },
    ],
  },
];

export const getRestaurantById = (id: string): RestaurantData | undefined => {
  return restaurantsData.find((restaurant) => restaurant._id === id);
};

export const getMenuItemById = (
  restaurantId: string,
  itemId: string,
): MenuItem | undefined => {
  const restaurant = getRestaurantById(restaurantId);
  return restaurant?.menu.find((item) => item._id === itemId);
};
