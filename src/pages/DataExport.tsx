import { useState } from "react";
import { Download, Calendar, FileText, Database } from "lucide-react";
import BackButton from "@/components/BackButton";
import { toast } from "sonner";

export default function DataExport() {
  const [selectedType, setSelectedType] = useState("orders");
  const [dateRange, setDateRange] = useState("last30");
  const [isExporting, setIsExporting] = useState(false);

  const exportTypes = [
    {
      id: "orders",
      name: "Order History",
      description: "Export all your order data",
      icon: FileText,
    },
    {
      id: "profile",
      name: "Profile Data",
      description: "Export your profile information",
      icon: Database,
    },
    {
      id: "preferences",
      name: "Preferences",
      description: "Export your app preferences and settings",
      icon: Database,
    },
  ];

  const dateRanges = [
    { id: "last7", name: "Last 7 days" },
    { id: "last30", name: "Last 30 days" },
    { id: "last90", name: "Last 90 days" },
    { id: "all", name: "All time" },
  ];

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Data exported successfully! Check your downloads folder.");
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Export</h1>
          <p className="text-gray-600">
            Download your data in various formats for your records.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Data Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportTypes.map((type) => (
              <div
                key={type.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedType === type.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex items-center mb-2">
                  <type.icon className="w-5 h-5 text-primary-600 mr-2" />
                  <h4 className="font-medium text-gray-900">{type.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Date Range
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dateRanges.map((range) => (
              <button
                key={range.id}
                className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                  dateRange === range.id
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setDateRange(range.id)}
              >
                <Calendar className="w-4 h-4 mx-auto mb-1" />
                {range.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Export Options
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">CSV Format</h4>
                <p className="text-sm text-gray-600">
                  Comma-separated values for spreadsheet applications
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">JSON Format</h4>
                <p className="text-sm text-gray-600">
                  JavaScript Object Notation for developers
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? "Exporting..." : "Export JSON"}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Privacy Notice:</strong> Your exported data will only
              contain information associated with your account. We respect your
              privacy and data security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
