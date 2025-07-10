// This file has been replaced by the cleaner Restaurants.tsx
// Redirecting to the main restaurants page

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EnhancedRestaurants() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/restaurants", { replace: true });
  }, [navigate]);

  return null;
}
