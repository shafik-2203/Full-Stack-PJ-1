// PWA registration and utilities
export class PWAService {
  private registration: ServiceWorkerRegistration | null = null;

  async registerServiceWorker(): Promise<void> {
    console.log("🚧 Service Worker registration disabled for debugging");

    // Clear any existing service workers
    if ("serviceWorker" in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          console.log("🗑️ Unregistering existing service worker");
          await registration.unregister();
        }
      } catch (error) {
        console.log("No existing service workers to unregister");
      }
    }

    // Temporarily disabled to prevent JSON caching issues
    // if ("serviceWorker" in navigator) {
    //   try {
    //     this.registration = await navigator.serviceWorker.register("/sw.js");
    //     console.log("Service Worker registered successfully");
    //   } catch (error) {
    //     console.error("Service Worker registration failed:", error);
    //   }
    // }
  }

  private showUpdatePrompt(): void {
    if (confirm("A new version of FASTIO is available. Update now?")) {
      window.location.reload();
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  async showNotification(
    title: string,
    options?: NotificationOptions,
  ): Promise<void> {
    if (!this.registration) {
      console.error("Service Worker not registered");
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-32x32.png",
      vibrate: [100, 50, 100],
      ...options,
    };

    await this.registration.showNotification(title, defaultOptions);
  }

  async checkForUpdates(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
    }
  }

  // Check if app can be installed
  canInstall(): boolean {
    return "beforeinstallprompt" in window;
  }

  // Prompt user to install app
  async promptInstall(): Promise<boolean> {
    const event = (window as any).deferredPrompt;
    if (!event) {
      return false;
    }

    event.prompt();
    const result = await event.userChoice;
    (window as any).deferredPrompt = null;

    return result.outcome === "accepted";
  }

  // Check if running as PWA
  isPWA(): boolean {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );
  }

  // Get device info
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
    };
  }

  // Check network status
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Setup offline/online listeners
  setupNetworkListeners(onOnline?: () => void, onOffline?: () => void): void {
    window.addEventListener("online", () => {
      console.log("App is online");
      onOnline?.();
    });

    window.addEventListener("offline", () => {
      console.log("App is offline");
      onOffline?.();
    });
  }
}

export const pwaService = new PWAService();

// Auto-register service worker - DISABLED for debugging
// if (typeof window !== "undefined") {
//   pwaService.registerServiceWorker();
// }