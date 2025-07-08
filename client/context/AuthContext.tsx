import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem("fastio_token"); // Match the key used elsewhere
    const storedUser = localStorage.getItem("auth_user");

    console.log(`🔍 Loading auth from storage:`, {
      hasToken: !!storedToken,
      hasUser: !!storedUser,
      tokenLength: storedToken?.length,
    });

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        apiClient.setToken(storedToken); // Sync with API client
        console.log(`✅ Auth restored from storage`);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("fastio_token");
        localStorage.removeItem("auth_user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User, authToken: string) => {
    console.log(
      `🔑 Logging in user: ${userData.email} with token length: ${authToken.length}`,
    );
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("fastio_token", authToken); // Use consistent key
    localStorage.setItem("auth_user", JSON.stringify(userData));
    apiClient.setToken(authToken); // Sync with API client
    console.log(`✅ User logged in and stored to localStorage`);
  };

  const logout = () => {
    console.log(`🚪 Logging out user`);
    setUser(null);
    setToken(null);
    localStorage.removeItem("fastio_token");
    localStorage.removeItem("auth_user");
    apiClient.setToken(null); // Clear API client token
  };

  const updateUser = (updatedUser: User) => {
    console.log(`🔄 Updating user profile: ${updatedUser.email}`);
    setUser(updatedUser);
    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}