import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Star } from "lucide-react";

export default function Food() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Restaurants
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-4">Food Item Details</h1>
          <p className="text-gray-600">Food item ID: {id}</p>
          <p className="text-gray-600 mt-2">
            This page will show detailed information about a specific food item.
          </p>
        </div>
      </div>
    </div>
  );
}
