import { useState, useEffect } from "react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowOfflineMessage(false), 5000);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Show message when offline or when coming back online
  if (!isOnline || showOfflineMessage) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div
          className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isOnline ? (
            <>✅ Back online - Using mock data due to CORS restrictions</>
          ) : (
            <>⚠️ No internet connection - Using offline data</>
          )}
        </div>
      </div>
    );
  }

  return null;
}
