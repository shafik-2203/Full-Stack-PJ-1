import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    employeeId: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/request-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        toast.success("Admin access request submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (err) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-3xl font-bold text-white">Request Submitted!</h2>
          <p className="text-gray-300">
            Your admin access request has been submitted successfully. You will
            be notified once it's reviewed by the super admin.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/admin-portal")}
              className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Back to Admin Portal
            </button>
            <Link
              to="/"
              className="block text-gray-400 hover:text-white transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <UserPlus className="w-12 h-12 text-primary-500 mx-auto" />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Request Admin Access
          </h2>
          <p className="mt-2 text-gray-300">
            Submit your employee request for admin privileges
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Work Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your work email"
              />
            </div>

            <div>
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                id="employeeId"
                required
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your employee ID"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Department
              </label>
              <select
                name="department"
                id="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="Operations">Operations</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Reason for Admin Access
              </label>
              <textarea
                name="reason"
                id="reason"
                rows={4}
                required
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Explain why you need admin access..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-medium rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="loading-dots">Submitting Request</span>
              ) : (
                "Submit Request"
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <BackButton
            to="/admin-portal"
            label="Back to Admin Portal"
            variant="dark"
          />
        </div>
      </div>
    </div>
  );
}
