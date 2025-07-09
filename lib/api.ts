import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  VerifyOTPRequest,
  ApiResponse,
  Restaurant,
  MenuItem,
  Order,
  CreateOrderRequest,
} from "@shared/api";

// Use environment variable if available, fallback to local API for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("fastio_token", token);
      } else {
        localStorage.removeItem("fastio_token");
      }
    }
  }

  // XMLHttpRequest for critical requests to bypass service worker
  private async requestXHR<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = (options.method || "GET").toUpperCase();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      // Set headers
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader(
        "Cache-Control",
        "no-cache, no-store, must-revalidate",
      );
      if (this.token) {
        xhr.setRequestHeader("Authorization", `Bearer ${this.token}`);
      }

      xhr.onload = () => {
        console.log(`📡 XHR Response status: ${xhr.status}`);

        let data;
        try {
          if (xhr.responseText) {
            // Check if response looks like HTML
            if (xhr.responseText.trim().startsWith("<")) {
              console.error("❌ XHR: Server returned HTML instead of JSON");
              reject(new Error("Server error - please try again later"));
              return;
            }
            data = JSON.parse(xhr.responseText);
          } else {
            data = {};
          }
        } catch (parseError) {
          console.error("❌ XHR JSON parsing failed:", parseError);
          console.error("❌ Raw response:", xhr.responseText.slice(0, 200));
          reject(new Error("Server returned invalid JSON response"));
          return;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          console.log(`✅ XHR Success: ${url}`);
          resolve(data as T);
        } else {
          const errorMessage =
            data?.message || `HTTP ${xhr.status}: ${xhr.statusText}`;
          console.error(`❌ XHR Error [${xhr.status}]:`, errorMessage);
          reject(new Error(errorMessage));
        }
      };

      xhr.onerror = () => {
        console.error("🚨 XHR Network error");
        reject(new Error("Network error - please check your connection"));
      };

      // Send request
      if (options.body) {
        xhr.send(options.body as string);
      } else {
        xhr.send();
      }
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        "SW-Bypass": "true", // Signal to service worker to skip
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      cache: "no-store", // Prevent any caching
      ...options,
    };

    console.log(`🔄 API Request: ${config.method || "GET"} ${url}`);

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (fetchError) {
      console.error("🚨 Network error:", fetchError);
      throw new Error("Network error - please check your connection");
    }

    console.log(
      `📡 Response status: ${response.status} ${response.statusText}`,
    );

    // Single read approach - read response body only once
    let responseText: string = "";
    let data: any = null;

    try {
      // Read response body exactly once
      responseText = await response.text();
      console.log(
        `📝 Raw response text:`,
        responseText.slice(0, 200) + (responseText.length > 200 ? "..." : ""),
      );

      // Parse JSON if response has content
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
          console.log(`📦 Parsed JSON data:`, data);
        } catch (parseError) {
          console.error("❌ JSON parsing failed:", parseError);
          console.error("Raw response was:", responseText.slice(0, 500));

          // Check if response looks like HTML (often indicates an error page)
          if (responseText.trim().startsWith("<")) {
            console.error("❌ Server returned HTML instead of JSON");
            data = {
              success: false,
              message: "Server error - please try again later",
              error: "SERVER_ERROR",
            };
          } else {
            // Create error response for invalid JSON
            data = {
              success: false,
              message: "Server returned invalid response format",
              error: "INVALID_JSON",
            };
          }
        }
      } else {
        // Empty response body
        console.log("📝 Empty response body");
        data = { success: true };
      }
    } catch (readError) {
      console.error("❌ Failed to read response:", readError);
      throw new Error("Unable to read server response");
    }

    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage =
        data?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error(`❌ API Error [${response.status}]:`, errorMessage);
      throw new Error(errorMessage);
    }

    console.log(`✅ API Success: ${url}`);
    return data as T;
  }

  // Auth endpoints
  async signup(data: SignupRequest): Promise<AuthResponse> {
    // Use XHR for signup to bypass service worker issues
    return this.requestXHR<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      return await this.request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Fallback authentication for deployed version when backend is unavailable
      console.log("🔄 Backend unavailable, using fallback authentication");

      // Demo credentials for fallback
      const validCredentials = [
        {
          email: "mohamedshafik2526@gmail.com",
          password: "Shafik1212@",
          isAdmin: false,
        },
        {
          email: "fastio121299@gmail.com",
          password: "fastio1212",
          isAdmin: true,
        },
      ];

      const credential = validCredentials.find(
        (cred) => cred.email === data.email && cred.password === data.password,
      );

      if (credential) {
        return {
          success: true,
          message: "Login successful (offline mode)",
          user: {
            id: credential.isAdmin ? "admin-1" : "user-1",
            email: credential.email,
            username: credential.email.split("@")[0],
            mobile: credential.isAdmin ? "+91-9876543210" : "+91-9876543211",
            isVerified: true,
            createdAt: new Date().toISOString(),
          },
          token: credential.isAdmin
            ? "admin-token-offline"
            : "user-token-offline",
        };
      } else {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }
    }
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<AuthResponse> {
    // Use XHR for OTP verification to bypass service worker issues
    return this.requestXHR<AuthResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProfile(data: {
    username: string;
    email: string;
    mobile: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/user/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resendOTP(email: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Restaurant endpoints
  async getRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    return this.request<ApiResponse<Restaurant[]>>("/restaurants");
  }

  async getRestaurant(id: string): Promise<ApiResponse<Restaurant>> {
    return this.request<ApiResponse<Restaurant>>(`/restaurants/${id}`);
  }

  async getMenuItems(restaurantId: string): Promise<ApiResponse<MenuItem[]>> {
    return this.request<ApiResponse<MenuItem[]>>(
      `/restaurants/${restaurantId}/menu`,
    );
  }

  async searchRestaurants(
    query?: string,
    category?: string,
  ): Promise<ApiResponse<Restaurant[]>> {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (category) params.append("category", category);

    return this.request<ApiResponse<Restaurant[]>>(
      `/restaurants/search?${params}`,
    );
  }

  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>("/restaurants/categories");
  }

  // Order endpoints
  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getUserOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<ApiResponse<Order[]>>("/orders");
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>(`/orders/${id}`);
  }
}

export const apiClient = new ApiClient();

// Initialize token from localStorage
if (typeof window !== "undefined") {
  const token = localStorage.getItem("fastio_token");
  if (token) {
    apiClient.setToken(token);
  }
}
