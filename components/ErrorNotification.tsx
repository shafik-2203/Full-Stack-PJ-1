import { useState, useEffect } from "react";

interface ErrorNotificationProps {
  message?: string;
  type?: "error" | "warning" | "info";
  autoHide?: boolean;
  duration?: number;
}

export default function ErrorNotification({
  message,
  type = "info",
  autoHide = true,
  duration = 5000,
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      if (autoHide) {
        const timer = setTimeout(() => setIsVisible(false), duration);
        return () => clearTimeout(timer);
      }
    }
  }, [message, autoHide, duration]);

  if (!isVisible || !message) return null;

  const getStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-500 border-red-600";
      case "warning":
        return "bg-yellow-500 border-yellow-600";
      default:
        return "bg-blue-500 border-blue-600";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`${getStyles()} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 transform transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2">
              {type === "error" && "❌"}
              {type === "warning" && "⚠️"}
              {type === "info" && "ℹ️"}
            </div>
            <div className="text-sm font-medium">{message}</div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-2 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>

        {type === "error" && (
          <div className="text-xs mt-2 text-white/80">
            Using offline data due to network restrictions
          </div>
        )}
      </div>
    </div>
  );
}
