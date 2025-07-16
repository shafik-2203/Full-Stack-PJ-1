import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/api";
import { User, Edit3, Save, X, Eye, EyeOff } from "lucide-react";

// Password validation function
const validatePassword = (
  password: string,
): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (@$!%*?&)",
    };
  }
  return { isValid: true, message: "" };
};

// Phone number validation function
const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Phone number validation
    if (!validatePhoneNumber(formData.mobile)) {
      setError("Please enter a valid phone number (10-15 digits)");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.updateProfile(
        {
          username: formData.username,
          email: formData.email,
          mobile: formData.mobile,
        },
        token,
      );

      if (response.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        updateUser(response.user);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.changePassword(
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        token,
      );

      if (response.success) {
        setSuccess("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(response.message || "Failed to change password");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Please log in to view your profile
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.username}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg ${
                    isEditing
                      ? "bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-orange-500"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg ${
                    isEditing
                      ? "bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-orange-500"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg ${
                    isEditing
                      ? "bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-orange-500"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user.username || "",
                      email: user.email || "",
                      mobile: user.mobile || "",
                    });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Change Password
            </h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-3 border rounded-lg bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-orange-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-3 border rounded-lg bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-orange-500"
                    placeholder="At least 8 chars, with uppercase, lowercase, number & special character"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-3 border rounded-lg bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          )}

          {!isChangingPassword && (
            <p className="text-gray-600">
              Your password should be at least 8 characters long and include
              uppercase, lowercase, numbers, and special characters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
