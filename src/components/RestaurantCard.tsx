import { useState } from "react";
import { Link } from "react-router-dom";
import { Restaurant } from "@shared/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Clock, Star, Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
  isLoading?: boolean;
  showFavorite?: boolean;
  onFavoriteToggle?: (restaurantId: string) => void;
  isFavorite?: boolean;
  className?: string;
}

export default function RestaurantCard({
  restaurant,
  isLoading = false,
  showFavorite = true,
  onFavoriteToggle,
  isFavorite = false,
  className,
}: RestaurantCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="relative">
          <Skeleton className="h-48 w-full" />
        </div>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(restaurant.id);
  };

  const getDeliveryFeeText = () => {
    return restaurant.deliveryFee === 0
      ? "Free delivery"
      : `₹${restaurant.deliveryFee} delivery`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-500";
    if (rating >= 4.0) return "bg-orange-500";
    if (rating >= 3.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const restaurantImage = restaurant.imageUrl || "/placeholder.svg";

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block">
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
          "border border-gray-200 hover:border-orange-300",
          !restaurant.isActive && "opacity-60 pointer-events-none",
          className,
        )}
      >
        {/* Restaurant Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {!isImageLoaded && !imageError && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}

          <img
            src={restaurantImage}
            alt={restaurant.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
              !isImageLoaded && "opacity-0",
            )}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setIsImageLoaded(true);
            }}
          />

          {/* Overlay for inactive restaurants */}
          {!restaurant.isActive && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Currently Closed
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          {showFavorite && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-white/80 backdrop-blur-sm",
                "hover:bg-white transition-colors duration-200",
                isFavorite && "text-red-500",
              )}
              onClick={handleFavoriteClick}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </Button>
          )}

          {/* Rating Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge
              className={cn(
                "text-white text-xs font-medium px-2 py-1",
                getRatingColor(restaurant.rating),
              )}
            >
              <Star className="w-3 h-3 mr-1 fill-current" />
              {restaurant.rating.toFixed(1)}
            </Badge>
          </div>

          {/* Delivery Fee Badge */}
          {restaurant.deliveryFee === 0 && (
            <div className="absolute bottom-2 right-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 text-xs"
              >
                Free Delivery
              </Badge>
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <CardHeader className="pb-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {restaurant.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Restaurant Category */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {restaurant.category}
            </Badge>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Truck className="w-4 h-4" />
              <span>{getDeliveryFeeText()}</span>
            </div>
          </div>

          {/* Minimum Order */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Min. order ₹{restaurant.minimumOrder}</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className={cn(
              "w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors",
              !restaurant.isActive && "opacity-50 cursor-not-allowed",
            )}
            disabled={!restaurant.isActive}
          >
            {restaurant.isActive ? "View Menu" : "Currently Closed"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
