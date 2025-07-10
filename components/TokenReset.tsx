import React from "react";
import { RefreshCw } from "lucide-react";

export default function TokenReset() {
  const clearAndRefresh = () => {
    // Clear all auth data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("fastio_token");
    localStorage.removeItem("fastio_user");

    console.log("🔄 Cleared all auth tokens and refreshing...");

    // Refresh the page
    window.location.reload();
  };

  return (
    <button
      onClick={clearAndRefresh}
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2 z-50"
    >
      <RefreshCw className="w-4 h-4" />
      Clear Auth & Refresh
    </button>
  );
}
