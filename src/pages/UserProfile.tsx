
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <p className="text-gray-500">You must be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="space-y-3">
        <div>
          <span className="font-semibold">Name:</span> {user.name || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user.role || "user"}
        </div>
      </div>
    </div>
  );
}
