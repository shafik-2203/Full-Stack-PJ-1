import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Show offline indicator if offline
    if (!navigator.onLine) {
      setShowOffline(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showOffline) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
          isOnline
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white animate-pulse"
        }`}
      >
        {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
        <span className="text-sm font-medium">
          {isOnline ? "Back online!" : "No internet connection"}
        </span>
      </div>
    </div>
  );
}
