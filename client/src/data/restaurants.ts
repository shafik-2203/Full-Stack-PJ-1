export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian: boolean;
  isPopular: boolean;
  rating: number;
  preparationTime: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  cuisines: string[];
  isOpen: boolean;
  location: {
    address: string;
    area: string;
    coordinates: [number, number];
  };
  menu: FoodItem[];
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Pizza Palace",
    description: "Authentic Italian pizzas with fresh ingredients",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 1250,
    deliveryTime: "25-35 min",
    deliveryFee: 2.99,
    minimumOrder: 15.0,
    cuisines: ["Italian", "Pizza", "Fast Food"],
    isOpen: true,
    location: {
      address: "123 Main Street",
      area: "Downtown",
      coordinates: [40.7128, -74.006],
    },
    menu: [
      {
        id: "p1",
        name: "Margherita Pizza",
        description:
          "Classic pizza with tomato sauce, mozzarella, and fresh basil",
        price: 12.99,
        image:
          "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop",
        category: "Pizza",
        isVegetarian: true,
        isPopular: true,
        rating: 4.6,
        preparationTime: "15-20 min",
      },
      {
        id: "p2",
        name: "Pepperoni Pizza",
        description: "Delicious pizza topped with pepperoni and cheese",
        price: 15.99,
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop",
        category: "Pizza",
        isVegetarian: false,
        isPopular: true,
        rating: 4.7,
        preparationTime: "15-20 min",
      },
      {
        id: "p3",
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with caesar dressing and croutons",
        price: 8.99,
        image:
          "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=300&h=200&fit=crop",
        category: "Salads",
        isVegetarian: true,
        isPopular: false,
        rating: 4.3,
        preparationTime: "10-15 min",
      },
    ],
  },
  {
    id: "2",
    name: "Burger Junction",
    description: "Juicy burgers and crispy fries made fresh daily",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=400&fit=crop",
    rating: 4.3,
    reviewCount: 890,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    minimumOrder: 12.0,
    cuisines: ["American", "Burgers", "Fast Food"],
    isOpen: true,
    location: {
      address: "456 Oak Avenue",
      area: "Midtown",
      coordinates: [40.758, -73.9855],
    },
    menu: [
      {
        id: "b1",
        name: "Classic Burger",
        description:
          "Beef patty with lettuce, tomato, onion, and special sauce",
        price: 10.99,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
        category: "Burgers",
        isVegetarian: false,
        isPopular: true,
        rating: 4.5,
        preparationTime: "12-18 min",
      },
      {
        id: "b2",
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables and avocado",
        price: 11.99,
        image:
          "https://images.unsplash.com/photo-1525059696034-4967a729002e?w=300&h=200&fit=crop",
        category: "Burgers",
        isVegetarian: true,
        isPopular: false,
        rating: 4.2,
        preparationTime: "12-18 min",
      },
      {
        id: "b3",
        name: "Crispy Fries",
        description: "Golden crispy french fries with sea salt",
        price: 4.99,
        image:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop",
        category: "Sides",
        isVegetarian: true,
        isPopular: true,
        rating: 4.4,
        preparationTime: "8-12 min",
      },
    ],
  },
  {
    id: "3",
    name: "Sushi Zen",
    description: "Fresh sushi and Japanese cuisine prepared by expert chefs",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 2100,
    deliveryTime: "30-45 min",
    deliveryFee: 3.99,
    minimumOrder: 25.0,
    cuisines: ["Japanese", "Sushi", "Asian"],
    isOpen: true,
    location: {
      address: "789 Cherry Blossom Lane",
      area: "Uptown",
      coordinates: [40.7831, -73.9712],
    },
    menu: [
      {
        id: "s1",
        name: "California Roll",
        description: "Avocado, cucumber, and crab stick with sesame seeds",
        price: 8.99,
        image:
          "https://images.unsplash.com/photo-1607301405390-d831c242a59b?w=300&h=200&fit=crop",
        category: "Sushi Rolls",
        isVegetarian: false,
        isPopular: true,
        rating: 4.7,
        preparationTime: "20-25 min",
      },
      {
        id: "s2",
        name: "Salmon Sashimi",
        description: "Fresh salmon sliced to perfection",
        price: 12.99,
        image:
          "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=300&h=200&fit=crop",
        category: "Sashimi",
        isVegetarian: false,
        isPopular: true,
        rating: 4.9,
        preparationTime: "15-20 min",
      },
      {
        id: "s3",
        name: "Miso Soup",
        description: "Traditional Japanese soup with tofu and seaweed",
        price: 3.99,
        image:
          "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop",
        category: "Soups",
        isVegetarian: true,
        isPopular: false,
        rating: 4.4,
        preparationTime: "10-15 min",
      },
    ],
  },
  {
    id: "4",
    name: "Taco Fiesta",
    description:
      "Authentic Mexican food with bold flavors and fresh ingredients",
    image:
      "https://images.unsplash.com/photo-1565299585323-38174c13a47e?w=400&h=300&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1565299585323-38174c13a47e?w=800&h=400&fit=crop",
    rating: 4.4,
    reviewCount: 756,
    deliveryTime: "25-35 min",
    deliveryFee: 2.49,
    minimumOrder: 18.0,
    cuisines: ["Mexican", "Tacos", "Latin"],
    isOpen: false,
    location: {
      address: "321 Fiesta Street",
      area: "South End",
      coordinates: [40.7505, -73.9934],
    },
    menu: [
      {
        id: "t1",
        name: "Beef Tacos",
        description: "Seasoned ground beef with lettuce, cheese, and tomatoes",
        price: 9.99,
        image:
          "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop",
        category: "Tacos",
        isVegetarian: false,
        isPopular: true,
        rating: 4.5,
        preparationTime: "15-20 min",
      },
      {
        id: "t2",
        name: "Chicken Quesadilla",
        description: "Grilled chicken with melted cheese in a flour tortilla",
        price: 11.99,
        image:
          "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300&h=200&fit=crop",
        category: "Quesadillas",
        isVegetarian: false,
        isPopular: true,
        rating: 4.6,
        preparationTime: "12-18 min",
      },
      {
        id: "t3",
        name: "Guacamole & Chips",
        description: "Fresh avocado dip with crispy tortilla chips",
        price: 6.99,
        image:
          "https://images.unsplash.com/photo-1541544181051-e46607ee9c87?w=300&h=200&fit=crop",
        category: "Appetizers",
        isVegetarian: true,
        isPopular: false,
        rating: 4.3,
        preparationTime: "8-12 min",
      },
    ],
  },
];

export const foodCategories = [
  "All",
  "Pizza",
  "Burgers",
  "Sushi",
  "Mexican",
  "Italian",
  "American",
  "Japanese",
  "Vegetarian",
  "Fast Food",
  "Healthy",
];

export const popularItems = restaurants
  .flatMap((restaurant) =>
    restaurant.menu
      .filter((item) => item.isPopular)
      .map((item) => ({
        ...item,
        restaurantName: restaurant.name,
        restaurantId: restaurant.id,
      })),
  )
  .sort((a, b) => b.rating - a.rating);
