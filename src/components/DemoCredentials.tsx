
import { useState } from "react";
import { toast } from "sonner";
import { Copy, ChevronUp, ChevronDown, Info } from "lucide-react";

const DEMO_CREDENTIALS = [
  { role: "User", email: "user@example.com", password: "user1234" },
  { role: "Admin", email: "admin@example.com", password: "admin1234" },
];

export default function DemoCredentials() {
  const [open, setOpen] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="my-4 border rounded p-4 bg-gray-50 text-sm">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center cursor-pointer"
      >
        <div className="flex items-center space-x-2 font-medium">
          <Info className="w-4 h-4" />
          <span>Demo Credentials</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
      {open && (
        <div className="mt-4 space-y-2">
          {DEMO_CREDENTIALS.map((cred, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <div>{cred.role}</div>
                <div className="text-gray-600">Email: {cred.email}</div>
                <div className="text-gray-600">Password: {cred.password}</div>
              </div>
              <div className="flex space-x-2">
                <Copy
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleCopy(cred.email)}
                />
                <Copy
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleCopy(cred.password)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
