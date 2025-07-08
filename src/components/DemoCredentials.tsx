
export default function DemoCredentials() {
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden mb-6 animate-slide-down">
      {/* Header - Always visible and clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-blue-100 transition-colors-smooth"
      >
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <h3 className="font-semibold text-blue-900">Demo Credentials</h3>
        </div>
        <div className="text-blue-600 transition-transform duration-200">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Content - Toggleable */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pb-4">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-blue-800 font-medium mb-1">For Login:</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between bg-white rounded px-3 py-2 transition-transform-smooth hover:scale-[1.01] transform-gpu">
                  <span className="text-gray-700">Email: demo@fastio.com</span>
                  <button
                    onClick={() => copyToClipboard("demo@fastio.com")}
                    className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-white rounded px-3 py-2 transition-transform-smooth hover:scale-[1.01] transform-gpu">
                  <span className="text-gray-700">Password: Demo123@</span>
                  <button
                    onClick={() => copyToClipboard("Demo123@")}
                    className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-blue-800 font-medium mb-1">
                For OTP Verification:
              </p>
              <div className="flex items-center justify-between bg-white rounded px-3 py-2 transition-transform-smooth hover:scale-[1.01] transform-gpu">
                <span className="text-gray-700">OTP: 123456</span>
                <button
                  onClick={() => copyToClipboard("123456")}
                  className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}