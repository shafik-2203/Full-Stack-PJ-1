import React, { useState, useEffect } from "react";
import {
  Download,
  Smartphone,
  Monitor,
  Chrome,
  Share,
  Plus,
  X,
  CheckCircle,
  ExternalLink,
  Zap,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installMethod, setInstallMethod] = useState<string>("");
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if running in PWA mode
    if (window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log("📱 PWA install prompt available");
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("🎉 PWA installed successfully!");
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setIsInstalling(false);

      // Show success message
      setTimeout(() => {
        alert(
          "🚀 FASTIO has been added to your device! You can now access it like a native app.",
        );
      }, 1000);
    };

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // For iOS Safari - show install instructions after a delay
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && isSafari && !window.navigator.standalone) {
      setTimeout(() => {
        setInstallMethod("manual");
        setShowInstallPrompt(true);
      }, 3000); // Show after 3 seconds
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    setIsInstalling(true);

    // If we have a deferred prompt, use it for automatic installation
    if (deferredPrompt) {
      try {
        console.log("🚀 Starting automatic PWA installation...");

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("✅ PWA installed successfully!");
          setIsInstalled(true);

          // Show success message
          setTimeout(() => {
            alert(
              "🎉 FASTIO installed successfully! You can now access it from your home screen.",
            );
          }, 500);
        } else {
          console.log("❌ User dismissed the install prompt");
          setShowInstallPrompt(true); // Show manual instructions
        }
      } catch (error) {
        console.error("PWA install error:", error);
        setShowInstallPrompt(true); // Show manual instructions
      } finally {
        setDeferredPrompt(null);
        setIsInstalling(false);
      }
    } else {
      // Try to trigger installation through other means
      console.log(
        "🔧 No deferred prompt available, showing manual installation guide",
      );
      setIsInstalling(false);
      setShowInstallPrompt(true);
      setInstallMethod("manual");
    }
  };

  const getDeviceInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("mobile")) {
      if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
        return {
          icon: <Share className="w-6 h-6" />,
          title: "Install on iPhone/iPad",
          steps: [
            "Tap the Share button in Safari",
            "Scroll down and tap 'Add to Home Screen'",
            "Tap 'Add' to install FASTIO",
          ],
        };
      } else if (userAgent.includes("chrome")) {
        return {
          icon: <Plus className="w-6 h-6" />,
          title: "Install on Android",
          steps: [
            "Tap the menu (⋮) in Chrome",
            "Select 'Add to Home screen'",
            "Tap 'Add' to install FASTIO",
          ],
        };
      }
    }

    return {
      icon: <Monitor className="w-6 h-6" />,
      title: "Install on Desktop",
      steps: [
        "Click the install icon in your browser's address bar",
        "Or use Ctrl+Shift+A (Chrome) to install",
        "Follow the prompts to add FASTIO to your desktop",
      ],
    };
  };

  // Always show install button - don't hide when installed
  if (!showInstallPrompt && !installMethod) {
    return (
      <button
        onClick={handleInstallClick}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 z-50"
      >
        <Download className="w-6 h-6" />
        <span className="hidden sm:inline font-medium">Install FASTIO</span>
      </button>
    );
  }

  const instructions = getDeviceInstructions();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Install FASTIO
              </h3>
              <p className="text-gray-600">Get the full app experience</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowInstallPrompt(false);
              setInstallMethod("");
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {deferredPrompt ? (
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Download className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">
                  Quick Install Available
                </span>
              </div>
              <p className="text-orange-700 text-sm mb-4">
                Install FASTIO directly to your device for faster access and
                offline support.
              </p>
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isInstalling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Install Now
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700 mb-4">
              {instructions.icon}
              <span className="font-semibold">{instructions.title}</span>
            </div>

            <div className="space-y-3">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">
                  App Benefits
                </span>
              </div>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Faster loading and smoother experience</li>
                <li>• Works offline for viewing orders and menus</li>
                <li>• Push notifications for order updates</li>
                <li>• Easy access from home screen</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setShowInstallPrompt(false);
              setInstallMethod("");
            }}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
