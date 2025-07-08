interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200";

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton components for common use cases
export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <div className="flex justify-between">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 animate-fade-in">
      <Skeleton variant="rectangular" width={80} height={80} />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-1/4 h-5" />
      </div>
    </div>
  );
}