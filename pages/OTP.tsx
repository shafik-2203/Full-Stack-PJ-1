import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/api";
import Logo from "../components/Logo";
import WelcomeAnimation from "../components/WelcomeAnimation";

export default function OTP() {
  const [otp, setOtp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [newUser, setNewUser] = useState<any>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("otp_email");
    if (!storedEmail) {
      navigate("/signup");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      setIsLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      // For development testing, allow bypass with special OTP
      if (otp === "000000" && !import.meta.env.PROD) {
        // Mock successful verification for development
        const mockUser = {
          id: "dev-user-" + Date.now(),
          email: email,
          username: email.split("@")[0],
          mobile: "9999999999",
          role: email.includes("admin") ? "admin" : "user",
          isAdmin: email.includes("admin"),
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        const mockToken = "dev-token-" + Date.now();

        apiClient.setToken(mockToken);
        login(mockUser, mockToken);
        localStorage.removeItem("otp_email");

        setNewUser(mockUser);
        setShowWelcome(true);
        return;
      }

      const response = await apiClient.verifyOtp({ email, otp });

      if (response.success && response.user && response.token) {
        // Update API client token
        apiClient.setToken(response.token);
        // Update auth context
        login(response.user, response.token);
        // Clear stored email
        localStorage.removeItem("otp_email");

        // Check if this is a new user (account just created)
        if (response.isNewUser) {
          setNewUser(response.user);
          setShowWelcome(true);
        } else {
          // Existing user, go directly to dashboard
          navigate("/dashboard");
        }
      } else {
        setError(response.message || "OTP verification failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.resendOTP(email);
      if (response.success) {
        alert("New OTP sent successfully");
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/signup");
  };

  // Show welcome animation for new users
  if (showWelcome && newUser) {
    return (
      <WelcomeAnimation
        username={newUser.username}
        onComplete={() => setShowWelcome(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 relative">
      {/* Logo */}
      <div className="absolute top-4 left-5">
        <Logo size={130} />
      </div>

      {/* OTP Form */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-gradient-to-br from-amber-300/30 to-amber-200/30 backdrop-blur-sm rounded-[70px] p-16 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-18">
            {/* Title */}
            <h1 className="text-4xl font-medium text-white text-center">OTP</h1>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            {/* OTP Input */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter the 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full h-20 px-6 bg-white rounded-2xl border-2 border-white/30 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200 text-center tracking-widest font-mono"
                  required
                  disabled={isLoading}
                  maxLength={6}
                />
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-white underline hover:no-underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-4">
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 border border-black accent-orange-500"
                />
              </div>
              <label
                htmlFor="terms"
                className="text-sm text-black font-medium leading-tight"
              >
                Welcome to FASTIO! By using our app and services, you agree to
                the following terms and conditions. Please read them carefully.
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 justify-center">
              <button
                type="button"
                onClick={handleBack}
                className="w-44 h-15 px-8 py-3 rounded-lg border border-orange-500 bg-white text-orange-500 font-medium text-xl transition-all hover:scale-105"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || !termsAccepted}
                className="w-44 h-15 px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium text-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
