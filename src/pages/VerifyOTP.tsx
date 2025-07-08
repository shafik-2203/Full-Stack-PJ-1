import type { User, Restaurant, CartItem, Order, ApiClient, OrderStatus, RestaurantStatus } from '@/types';
import BackButton from "@/components/BackButton";
import DemoCredentials from "@/components/DemoCredentials";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem("fastio_otp_email");
    if (!storedEmail) {
      navigate("/signup");
      return;
    }
    setEmail(storedEmail);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      await verifyOTP(email, otp);
      localStorage.removeItem("fastio_otp_email");
      localStorage.setItem("isNewUser", "true"); // Flag for welcome animation
      toast.success("Account verified successfully!");
      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "OTP verification failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      await resendOTP(email);
      setCanResend(false);
      setCountdown(60);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend OTP",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <BackButton to="/signup" variant="light" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Verify Your Account
          </h1>
          <p className="text-primary-100">
            We've sent a 6-digit OTP to your email
          </p>
          <p className="text-primary-200 text-sm mt-2">{email}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <DemoCredentials />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                className="input w-full text-center text-2xl font-mono tracking-wider"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <span className="loading-dots">Verifying</span>
              ) : (
                "Verify Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Didn't receive the code?</p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-primary-600 hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-500">
                Resend in {countdown} seconds
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
