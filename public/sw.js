// FASTIO Service Worker - DISABLED for debugging
// This service worker is temporarily disabled to prevent caching issues
console.log("🚧 FASTIO Service Worker disabled for debugging");

// Immediately unregister and skip all caching
self.addEventListener("install", (event) => {
  console.log("🚧 Service Worker installing but skipping cache");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("🚧 Service Worker activated but clearing all caches");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("🗑️ Clearing cache:", cacheName);
            return caches.delete(cacheName);
          }),
        );
      })
      .then(() => {
        self.clients.claim();
      }),
  );
});

self.addEventListener("fetch", (event) => {
  // Don't intercept any requests - let them go through normally
  return;
});

return; // Exit early to prevent the rest of the SW from loading

const CACHE_NAME = "fastio-v2.3";
const STATIC_CACHE = "fastio-static-v2.3";
const DYNAMIC_CACHE = "fastio-dynamic-v2.3";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/fastio-icon.svg",
  "/fastio-icon-144.png",
  "/fastio-icon-192.png",
  "/fastio-icon-512.png",
  "/icons/icon-192x192.png",
  "/icons/icon-32x32.png",
  "/icons/icon-16x16.png",
  "/favicon.ico",
];

// API endpoints to cache for offline functionality
const API_ENDPOINTS = [
  "/api/restaurants",
  "/api/restaurants/categories",
  "/api/menu/categories",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("🔧 FASTIO Service Worker installing...");

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("📦 Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting(), // Take control immediately
    ]),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("✅ FASTIO Service Worker activated");

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("🗑️ Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      }),
      self.clients.claim(), // Take control of all clients
    ]),
  );
});

// Fetch event - handle network requests with caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip requests with bypass header, API requests, or JS/CSS assets to prevent conflicts
  if (
    request.headers.get("SW-Bypass") ||
    url.pathname.startsWith("/api/") ||
    url.pathname === "/health" ||
    url.pathname.startsWith("/health/") ||
    url.pathname.includes("/assets/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".mjs") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".ts") ||
    url.pathname.endsWith(".tsx")
  ) {
    // Let these requests go through without any interception
    return;
  }

  // Handle static assets
  if (
    STATIC_ASSETS.includes(url.pathname) ||
    url.pathname.includes("/icons/") ||
    url.pathname.includes("fastio-icon")
  ) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: try network first, then cache for other assets
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches
            .open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            })
            .catch(() => {
              // Ignore cache errors
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      }),
  );
});

// Handle API requests - network first, cache fallback
async function handleAPIRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);

    // Only cache GET requests for read-only endpoints to avoid conflicts
    if (
      response.ok &&
      request.method === "GET" &&
      (request.url.includes("/restaurants") ||
        request.url.includes("/categories") ||
        request.url.includes("/menu"))
    ) {
      try {
        const cache = await caches.open(DYNAMIC_CACHE);
        // Use a new response clone to avoid conflicts
        const responseForCache = response.clone();
        cache.put(request, responseForCache);
      } catch (cacheError) {
        console.log("⚠️ Failed to cache response:", cacheError);
        // Don't throw, just skip caching
      }
    }

    return response;
  } catch (error) {
    // Fallback to cache only for safe GET requests
    if (request.method === "GET") {
      const cachedResponse = await caches.match(request);

      if (cachedResponse) {
        console.log("📱 Serving API from cache:", request.url);
        return cachedResponse;
      }
    }

    // Return offline fallback for API requests
    return new Response(
      JSON.stringify({
        success: false,
        message: "You're offline. Please check your connection.",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Handle static assets - cache first
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    console.log("❌ Failed to fetch static asset:", request.url);
    throw error;
  }
}

// Handle navigation requests - app shell pattern
async function handleNavigation(request) {
  try {
    // Try network first
    return await fetch(request);
  } catch (error) {
    // Fallback to cached index.html (app shell)
    const cachedApp = await caches.match("/index.html");
    return cachedApp || new Response("Offline", { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("🔄 Background sync triggered:", event.tag);

  if (event.tag === "order-sync") {
    event.waitUntil(syncOrders());
  }
});

// Sync pending orders when back online
async function syncOrders() {
  try {
    // Get pending orders from IndexedDB (if implemented)
    console.log("📦 Syncing pending orders...");
    // Implementation would sync offline orders when back online
  } catch (error) {
    console.error("❌ Order sync failed:", error);
  }
}

// Push notifications for order updates
self.addEventListener("push", (event) => {
  console.log("🔔 Push notification received");

  const options = {
    body: event.data
      ? event.data.text()
      : "Your FASTIO order has been updated!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-32x32.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "order-notification",
    },
    actions: [
      {
        action: "view-order",
        title: "View Order",
        icon: "/icons/icon-32x32.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/icon-32x32.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("FASTIO Order Update", options),
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification clicked:", event.action);

  event.notification.close();

  if (event.action === "view-order") {
    event.waitUntil(clients.openWindow("/orders"));
  }
});

console.log("🚀 FASTIO Service Worker loaded successfully!");
