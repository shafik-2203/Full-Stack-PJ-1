import { Code } from "lucide-react";

export default function DevModeIndicator() {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-xs rounded-lg shadow-lg">
        <Code size={14} />
        <span className="font-medium">Development Mode</span>
      </div>
    </div>
  );
}
