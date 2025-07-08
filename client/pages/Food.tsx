import { Store } from 'lucide-react';
import Logo from "../components/Logo";

export default function Food() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  // Use ref to prevent scroll to top during search
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Debounced search with scroll position preservation
  const debouncedSearch = useCallback((query: string, category: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      // Store current scroll position
      const currentScrollY = window.scrollY;

      await performSearch(query, category);

      // Restore scroll position after search
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollY);
      });
    }, 300);
  }, []);

  useEffect(() => {
    debouncedSearch(searchQuery, selectedCategory);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedCategory, debouncedSearch]);

  const fetchInitialData = async () => {
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
      setError("Failed to load food options");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (query: string, category: string) => {
    try {
      setError("");

      // If no search query and no category selected, show all restaurants
      if (!query.trim() && !category) {
        const response = await apiClient.getRestaurants();
        if (response.success) {
          setRestaurants(response.data || []);
        }
        return;
      }

      // Search with filters
      if (query.trim()) {
        const response = await apiClient.searchRestaurants(query);
        if (response.success) {
          let filteredResults = response.data || [];

          // Further filter by category if selected
          if (category) {
            filteredResults = filteredResults.filter(
              (restaurant) =>
                restaurant.category.toLowerCase() === category.toLowerCase(),
            );
          }

          setRestaurants(filteredResults);
        } else {
          setError("Failed to search food");
          setRestaurants([]);
        }
      }
      // If only category is selected, filter by category
      else if (category) {
        const response = await apiClient.getRestaurants();
        if (response.success) {
          const filteredResults = (response.data || []).filter(
            (restaurant) =>
              restaurant.category.toLowerCase() === category.toLowerCase(),
          );
          setRestaurants(filteredResults);
        }
      }
    } catch (err) {
      setError("Search failed");
      console.error("Error searching:", err);
      setRestaurants([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    fetchInitialData();
  };

  if (isLoading && restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading food options...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600"
    >
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
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
        {/* Search and Filters */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 sticky top-24 z-5">
          <h2 className="text-2xl font-bold text-white mb-4">
            🔍 Search for Food & Restaurants
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for dishes, restaurants, or cuisines..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 rounded-full border-2 border-white/30 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-3 rounded-full border-2 border-white/30 bg-white text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200 appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Search Stats */}
          <div className="flex items-center justify-between text-white/80 text-sm">
            <span>
              {restaurants.length} food option
              {restaurants.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </span>
            {isLoading && (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Searching...
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Categories Quick Filter */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedCategory === ""
                  ? "bg-white text-orange-500"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-white text-orange-500"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="h-48 bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center">
                <div className="text-white text-6xl">🍽️</div>
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
                  <span className="text-gray-600">
                    {restaurant.deliveryTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-semibold">
                    ${restaurant.deliveryFee} delivery
                  </span>
                  <span className="text-gray-600 text-sm">
                    Min: ${restaurant.minimumOrder}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                    {restaurant.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {restaurants.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-white text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No food options found
            </h3>
            <p className="text-white/80 mb-4">
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filters"
                : "Loading food options..."}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-white text-orange-500 rounded-full hover:bg-orange-100 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}