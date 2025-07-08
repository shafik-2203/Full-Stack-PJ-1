import type { User, Restaurant, CartItem, Order, ApiClient, OrderStatus, RestaurantStatus } from '@/types';
// This file has been replaced by the cleaner Restaurants.tsx
// Redirecting to the main restaurants page

export default function EnhancedRestaurants() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/restaurants", { replace: true });
  }, [navigate]);

  return null;
}
