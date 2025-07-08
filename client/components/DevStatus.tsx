
interface HealthStatus {
  success: boolean;
  status: string;
  database: string;
  mode: string;
}

export default function DevStatus() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiBase =
          import.meta.env.VITE_API_BASE_URL || "https://fsd-project1-backend.onrender.com";
        const response = await fetch(`${apiBase}/health?t=${Date.now()}`);
        const data = await response.json();
        setHealthStatus(data);
      } catch (error) {
        console.error("Health check failed:", error);
        setHealthStatus({
          success: false,
          status: "error",
          database: "Connection Failed",
          mode: "offline",
        });
      }
    };

    checkHealth();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isDevelopmentMode = healthStatus?.mode === "development";
  const isProductionMode = healthStatus?.mode === "production";
  const isOfflineMode =
    healthStatus?.database?.includes("Offline Mode") ||
    healthStatus?.database?.includes("In-Memory");
  const isMongoConnected =
    healthStatus?.database?.includes("MongoDB Connected");

  const shouldShowStatus =
    !healthStatus ||
    !healthStatus?.success ||
    isOfflineMode ||
    !isOnline ||
    (isDevelopmentMode && isMongoConnected);

  if (!shouldShowStatus) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <Alert className="rounded-none border-0 border-b border-red-200 bg-red-50 text-red-800">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're offline. Some features may not work properly.
          </AlertDescription>
        </Alert>
      )}

      {isDevelopmentMode && isMongoConnected && isOnline && (
        <Alert className="rounded-none border-0 border-b border-blue-200 bg-blue-50 text-blue-800">
          <Wifi className="h-4 w-4" />
          <AlertDescription>
            Development Mode: Connected to production database.
          </AlertDescription>
        </Alert>
      )}

      {isOfflineMode && isOnline && (
        <Alert className="rounded-none border-0 border-b border-yellow-200 bg-yellow-50 text-yellow-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Database temporarily unavailable. Using cached data.
          </AlertDescription>
        </Alert>
      )}

      {healthStatus && !healthStatus.success && (
        <Alert className="rounded-none border-0 border-b border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Server connection failed. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}