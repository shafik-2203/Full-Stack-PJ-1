import Logo from "../components/Logo";

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

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    // Phone number validation
    if (!validatePhoneNumber(formData.mobile)) {
      setError("Please enter a valid phone number (10-15 digits)");
      return;
    }

    setIsLoading(true);
    setError("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.mobile
    ) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🚀 Starting signup process...");
      const response = await apiClient.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
      });

      console.log("✅ Signup response received:", response);

      if (response && response.success) {
        console.log("🎉 Signup successful, navigating to OTP verification");
        localStorage.setItem("otp_email", formData.email);
        navigate("/otp");
      } else {
        console.error("❌ Signup failed with response:", response);
        setError(response?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("🚨 Signup error caught:", err);

      let errorMessage = "Signup failed. Please try again.";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Handle specific error cases
      if (errorMessage.includes("already exists")) {
        setError(
          "An account with these details already exists. Please try logging in instead.",
        );
        setTimeout(() => navigate("/login"), 3000);
      } else if (errorMessage.includes("Network error")) {
        setError(
          "Network connection issue. Please check your internet and try again.",
        );
      } else if (errorMessage.includes("Invalid JSON")) {
        setError("Server communication error. Please try again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 relative overflow-x-hidden">
      <div className="absolute top-2 left-2 sm:top-4 sm:left-5 z-10">
        <Logo size={80} className="sm:hidden" />
        <Logo size={130} className="hidden sm:block" />
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 py-8 safe-area-top safe-area-bottom">
        <div className="w-full max-w-sm sm:max-w-md bg-gradient-to-br from-amber-300/30 to-amber-200/30 backdrop-blur-sm rounded-3xl sm:rounded-[50px] p-6 sm:p-10 lg:p-14 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 lg:space-y-7"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white text-center">
              Sign up
            </h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Create your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full h-12 sm:h-16 lg:h-20 px-4 sm:px-6 bg-white rounded-lg sm:rounded-xl border-2 border-white/30 text-sm sm:text-base lg:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-12 sm:h-16 lg:h-20 px-4 sm:px-6 bg-white rounded-lg sm:rounded-xl border-2 border-white/30 text-sm sm:text-base lg:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Strong password (8+ chars, mixed case, numbers, symbols)"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-12 sm:h-16 lg:h-20 px-4 sm:px-6 bg-white rounded-lg sm:rounded-xl border-2 border-white/30 text-sm sm:text-base lg:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full h-12 sm:h-16 lg:h-20 px-4 sm:px-6 bg-white rounded-lg sm:rounded-xl border-2 border-white/30 text-sm sm:text-base lg:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full h-12 sm:h-16 lg:h-20 px-4 sm:px-6 bg-white rounded-lg sm:rounded-xl border-2 border-white/30 text-sm sm:text-base lg:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 sm:h-16 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold text-lg sm:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Sign up"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBack}
                className="text-white/80 hover:text-white text-sm sm:text-base transition-colors"
              >
                ← Back to home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}