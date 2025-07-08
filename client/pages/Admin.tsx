import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  UserPlus,
  Trash2,
  CheckSquare,
  XSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  username: string;
  mobile: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  total: number;
  verified: number;
  unverified: number;
}

interface AdminPermission {
  email: string;
  granted_by: string;
  granted_at: string;
  is_active: boolean;
}

interface AdminRequest {
  id: string;
  name: string;
  email: string;
  department: string;
  employee_id: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermission[]>(
    [],
  );
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const navigate = useNavigate();

  // Check if user is authenticated as admin
  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]);

  const getAuthHeaders = () => {
    const adminAuth = sessionStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin-login");
      return {};
    }
    return {
      Authorization: `Bearer ${adminAuth}`,
      "Content-Type": "application/json",
    };
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      // Fetch users
      const usersResponse = await fetch("/api/debug/users", { headers });
      const usersData = await usersResponse.json();

      // Fetch stats
      const statsResponse = await fetch("/api/admin/user-stats", { headers });
      const statsData = await statsResponse.json();

      // Fetch admin permissions
      const permissionsResponse = await fetch("/api/admin/permissions", {
        headers,
      });
      const permissionsData = await permissionsResponse.json();

      // Fetch admin requests
      const requestsResponse = await fetch("/api/admin/requests", { headers });
      const requestsData = await requestsResponse.json();

      if (usersResponse.status === 401 || usersResponse.status === 403) {
        sessionStorage.removeItem("adminAuth");
        navigate("/admin-login");
        return;
      }

      if (usersData.success) {
        const userData = usersData.users || [];
        console.log("User data received:", userData);
        setUsers(userData);
      } else {
        setError(usersData.message || "Failed to fetch users");
      }

      if (statsData.success) {
        setStats(statsData.stats);
      }

      if (permissionsData.success) {
        setAdminPermissions(permissionsData.permissions || []);
      }

      if (requestsData.success) {
        setAdminRequests(requestsData.requests || []);
      }
    } catch (err) {
      setError("Failed to fetch user data");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const clearAllUsers = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all users? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const response = await fetch("/api/admin/users/all", {
        method: "DELETE",
        headers,
      });
      const data = await response.json();

      if (data.success) {
        alert("All users cleared successfully");
        fetchUserData();
      } else {
        alert("Failed to clear users: " + data.message);
      }
    } catch (err) {
      alert("Error clearing users");
      console.error("Error:", err);
    }
  };

  const grantAdminAccess = async () => {
    if (!newAdminEmail.trim()) {
      alert("Please enter an email address");
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const response = await fetch("/api/admin/permissions", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newAdminEmail }),
      });
      const data = await response.json();

      if (data.success) {
        alert(`Admin access granted to ${newAdminEmail}`);
        setNewAdminEmail("");
        fetchUserData();
      } else {
        alert("Failed to grant admin access: " + data.message);
      }
    } catch (err) {
      alert("Error granting admin access");
      console.error("Error:", err);
    }
  };

  const revokeAdminAccess = async (email: string) => {
    if (
      !confirm(`Are you sure you want to revoke admin access for ${email}?`)
    ) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const response = await fetch(
        `/api/admin/permissions/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          headers,
        },
      );
      const data = await response.json();

      if (data.success) {
        alert(`Admin access revoked for ${email}`);
        fetchUserData();
      } else {
        alert("Failed to revoke admin access: " + data.message);
      }
    } catch (err) {
      alert("Error revoking admin access");
      console.error("Error:", err);
    }
  };

  const removeUser = async (userId: string, userEmail: string) => {
    // Debug: Check if userId is properly defined
    console.log("Remove user called with:", { userId, userEmail });

    if (!userId) {
      alert("Error: User ID is missing. Cannot remove user.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to remove user ${userEmail}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
          headers,
        },
      );
      const data = await response.json();

      if (data.success) {
        alert(`User ${userEmail} removed successfully`);
        fetchUserData();
      } else {
        alert("Failed to remove user: " + data.message);
      }
    } catch (err) {
      alert("Error removing user");
      console.error("Error:", err);
    }
  };

  const handleAdminRequest = async (
    requestId: string,
    action: "approve" | "reject",
  ) => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const response = await fetch(
        `/api/admin/requests/${requestId}/${action}`,
        {
          method: "POST",
          headers,
        },
      );
      const data = await response.json();

      if (data.success) {
        alert(`Request ${action}d successfully`);
        fetchUserData();
      } else {
        alert(`Failed to ${action} request: ` + data.message);
      }
    } catch (err) {
      alert(`Error ${action}ing request`);
      console.error("Error:", err);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-auto sm:h-16 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/"
                className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back to App</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                User Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={fetchUserData}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm sm:text-base"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Sync</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Verified Users
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.verified}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center">
                <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Unverified Users
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.unverified}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Requests */}
        {adminRequests.filter((r) => r.status === "pending").length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pending Admin Requests (
              {adminRequests.filter((r) => r.status === "pending").length})
            </h2>
            <div className="space-y-4">
              {adminRequests
                .filter((r) => r.status === "pending")
                .map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {request.name}
                        </h3>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="text-sm text-gray-500">
                          {request.department} • ID: {request.employee_id}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          {request.reason}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Requested: {formatDate(request.requested_at)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          key={`approve-${request.id}`}
                          onClick={() =>
                            handleAdminRequest(request.id, "approve")
                          }
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          <CheckSquare className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          key={`reject-${request.id}`}
                          onClick={() =>
                            handleAdminRequest(request.id, "reject")
                          }
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          <XSquare className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Admin Management */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Admin Management
          </h2>

          {/* Grant Admin Access */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-2">
              Grant Admin Access
            </h3>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter employee email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="flex-1 p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={grantAdminAccess}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
              >
                <UserPlus className="w-4 h-4" />
                Grant Access
              </button>
            </div>
          </div>

          {/* Current Admin Users */}
          {adminPermissions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">
                Current Admin Users
              </h3>
              <div className="space-y-2">
                {adminPermissions
                  .filter((p) => p.is_active)
                  .map((permission) => (
                    <div
                      key={permission.email}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {permission.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          Granted by {permission.granted_by} on{" "}
                          {formatDate(permission.granted_at)}
                        </div>
                      </div>
                      <button
                        onClick={() => revokeAdminAccess(permission.email)}
                        className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Revoke
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            User Management Actions
          </h2>
          <button
            onClick={clearAllUsers}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            Clear All Users
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              All Users
            </h2>
          </div>

          {loading ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Loading users...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 sm:p-8 text-center">
              <p className="text-sm sm:text-base text-red-600">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                No users found
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={user.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.mobile}
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_verified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-gray-500">
                        Created: {formatDate(user.created_at)}
                      </div>
                      <button
                        onClick={() => removeUser(user.id, user.email)}
                        className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.mobile}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_verified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.is_verified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>Created: {formatDate(user.created_at)}</div>
                            <div>Updated: {formatDate(user.updated_at)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => removeUser(user.id, user.email)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
