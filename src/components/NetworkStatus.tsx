
import { useEffect, useState } from "react";
import { Wifi } from "lucide-react";

export default function NetworkStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 text-red-800 px-4 py-2 rounded shadow">
      <Wifi className="inline-block mr-2" /> You are offline
    </div>
  );
}
