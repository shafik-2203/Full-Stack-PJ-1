import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/api";

export default function TestAuth() {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState("");
  const { login } = useAuth();

  const createMockUser = () => {
    const mockUser = {
      id: "test-user-id",
      email: "test@fastio.com",
      username: "testuser",
      mobile: "9999999999",
      role: "user",
      isAdmin: false,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    const mockToken = "mock-jwt-token-for-testing";

    login(mockUser, mockToken);
    setStatus("✅ Logged in with mock user credentials");
  };

  const createMockAdmin = () => {
    const mockAdmin = {
      id: "test-admin-id",
      email: "admin@fastio.com",
      username: "testadmin",
      mobile: "8888888888",
      role: "admin",
      isAdmin: true,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    const mockToken = "mock-admin-jwt-token-for-testing";

    login(mockAdmin, mockToken);
    setStatus("✅ Logged in with mock admin credentials");
  };

  const testBackendConnection = async () => {
    try {
      setStatus("🔄 Testing backend connection...");
      const response = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/health",
      );
      const data = await response.json();
      setStatus(`✅ Backend connected: ${data.status} - ${data.database}`);
    } catch (error) {
      setStatus(`❌ Backend connection failed: ${error.message}`);
    }
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-500 text-white p-2 rounded-full text-xs hover:bg-blue-600"
        title="Test Auth Helper"
      >
        🔧
      </button>

      {isVisible && (
        <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-xl border p-4 min-w-80">
          <h3 className="font-bold text-sm mb-3">🧪 Test Auth Helper</h3>

          <div className="space-y-2 mb-4">
            <button
              onClick={createMockUser}
              className="w-full bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
            >
              Login as Mock User
            </button>
            <button
              onClick={createMockAdmin}
              className="w-full bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600"
            >
              Login as Mock Admin
            </button>
            <button
              onClick={testBackendConnection}
              className="w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
            >
              Test Backend Connection
            </button>
          </div>

          <div className="text-xs">
            <div className="mb-2">
              <strong>Credentials to try:</strong>
              <div className="text-gray-600">
                Admin: fastio121299@gmail.com / Fastio1212@
                <br />
                User: mohamedshafik2526@gmail.com / Shafik1212@
              </div>
            </div>
            {status && (
              <div className="bg-gray-100 p-2 rounded text-xs">{status}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
