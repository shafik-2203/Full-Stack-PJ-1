import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../lib/api";
import Logo from "../components/Logo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP + new password
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStep(2);
        setMessage(
          "OTP sent to your email. Please enter it below with your new password.",
        );
        // For development, show OTP in console
        if (data.debug) {
          console.log("🔑 Password Reset OTP:", data.debug);
        }
      } else {
        setMessage(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/confirm-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(
          "Password reset successfully! You can now login with your new password.",
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Failed to reset password");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 relative">
      {/* Logo */}
      <div className="absolute top-4 left-5">
        <Logo size={130} />
      </div>

      {/* Form */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-gradient-to-br from-amber-300/30 to-amber-200/30 backdrop-blur-sm rounded-[70px] p-16 shadow-lg">
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-11">
              {/* Title */}
              <h1 className="text-4xl font-medium text-white text-center">
                Reset Password
              </h1>

              {/* Message */}
              {message && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                  {message}
                </div>
              )}

              <p className="text-white text-center text-lg">
                Enter your email address to receive a password reset OTP.
              </p>

              {/* Email Field */}
              <div className="space-y-7">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-20 px-6 bg-white rounded-2xl border-2 border-white/30 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
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
                  disabled={isLoading}
                  className="w-44 h-15 px-14 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium text-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePasswordReset} className="space-y-8">
              {/* Title */}
              <h1 className="text-3xl font-medium text-white text-center">
                Enter OTP & New Password
              </h1>

              {/* Message */}
              {message && (
                <div
                  className={`border px-4 py-3 rounded-lg text-center ${
                    message.includes("successfully")
                      ? "bg-green-100 border-green-400 text-green-700"
                      : "bg-red-100 border-red-400 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full h-16 px-6 bg-white rounded-2xl border-2 border-white/30 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200 text-center tracking-widest font-mono"
                    required
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-16 px-6 bg-white rounded-2xl border-2 border-white/30 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-16 px-6 bg-white rounded-2xl border-2 border-white/30 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-44 h-15 px-8 py-3 rounded-lg border border-orange-500 bg-white text-orange-500 font-medium text-xl transition-all hover:scale-105"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-44 h-15 px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium text-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
