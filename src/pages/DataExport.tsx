import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Package,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function DataExport() {
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [isExporting, setIsExporting] = useState(false);

  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to export data
          </h2>
          <Link to="/login" className="text-orange-600 hover:text-orange-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const dataTypes = [
    {
      id: "orders",
      name: "Order History",
      description: "All your past orders and receipts",
      icon: Package,
    },
    {
      id: "profile",
      name: "Profile Data",
      description: "Your account information and preferences",
      icon: User,
    },
    {
      id: "favorites",
      name: "Favorites",
      description: "Your favorite restaurants and dishes",
      icon: FileText,
    },
  ];

  const handleDataTypeToggle = (dataType: string) => {
    setSelectedData((prev) =>
      prev.includes(dataType)
        ? prev.filter((type) => type !== dataType)
        : [...prev, dataType],
    );
  };

  const handleExport = async () => {
    if (selectedData.length === 0) {
      alert("Please select at least one data type to export");
      return;
    }

    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert("Export completed! Check your downloads folder.");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Export Your Data
            </h1>
            <p className="text-gray-600">
              Download your personal data in a portable format
            </p>
          </div>

          <div className="space-y-6">
            {/* Data Types Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Select Data to Export
              </h3>
              <div className="space-y-3">
                {dataTypes.map((dataType) => (
                  <label
                    key={dataType.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedData.includes(dataType.id)}
                      onChange={() => handleDataTypeToggle(dataType.id)}
                      className="mr-4 w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <dataType.icon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {dataType.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {dataType.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date Range (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleExport}
                disabled={isExporting || selectedData.length === 0}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Export Selected Data
                  </>
                )}
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Privacy Notice</h4>
              <p className="text-sm text-blue-800">
                Your data export will be available for download for 7 days.
                After that, it will be automatically deleted for security
                reasons. The exported data is encrypted and can only be
                downloaded by you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
