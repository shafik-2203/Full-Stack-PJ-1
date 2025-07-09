import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function DataExport() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      setMessage("No data available to export");
      return;
    }

    // Convert data to CSV format
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in CSV values
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(","),
      ),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportOrders = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/export/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        downloadCSV(data.data, "my_orders");
        setMessage("Orders exported successfully!");
      } else {
        setMessage(data.message || "Failed to export orders");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportProfile = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/export/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        downloadCSV([data.data], "my_profile");
        setMessage("Profile exported successfully!");
      } else {
        setMessage(data.message || "Failed to export profile");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAll = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/export/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Export each data type separately
        if (data.data.profile) {
          downloadCSV([data.data.profile], "my_profile");
        }
        if (data.data.orders?.length > 0) {
          downloadCSV(data.data.orders, "my_orders");
        }
        if (data.data.transactions?.length > 0) {
          downloadCSV(data.data.transactions, "my_transactions");
        }
        setMessage("All data exported successfully!");
      } else {
        setMessage(data.message || "Failed to export data");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 relative">
      {/* Logo */}
      <div className="absolute top-4 left-5">
        <Logo size={130} />
      </div>

      {/* Form */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-gradient-to-br from-amber-300/30 to-amber-200/30 backdrop-blur-sm rounded-[70px] p-16 shadow-lg">
          <div className="space-y-8">
            {/* Title */}
            <h1 className="text-4xl font-medium text-white text-center">
              Export Data
            </h1>

            <p className="text-white text-center text-lg">
              Download your FASTIO data in CSV format
            </p>

            {/* Message */}
            {message && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg text-center">
                {message}
              </div>
            )}

            {/* Export Options */}
            <div className="space-y-4">
              <button
                onClick={handleExportProfile}
                disabled={isLoading}
                className="w-full h-16 px-6 bg-white rounded-2xl border-2 border-white/30 text-lg text-gray-800 font-medium transition-all hover:scale-105 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                📄 Export Profile Data
              </button>

              <button
                onClick={handleExportOrders}
                disabled={isLoading}
                className="w-full h-16 px-6 bg-white rounded-2xl border-2 border-white/30 text-lg text-gray-800 font-medium transition-all hover:scale-105 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                🍽️ Export Order History
              </button>

              <button
                onClick={handleExportAll}
                disabled={isLoading}
                className="w-full h-16 px-6 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📊 Export All Data
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={handleBack}
                className="w-44 h-15 px-8 py-3 rounded-lg border border-orange-500 bg-white text-orange-500 font-medium text-xl transition-all hover:scale-105"
              >
                Back
              </button>
            </div>

            {isLoading && (
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p className="mt-2">Processing...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
