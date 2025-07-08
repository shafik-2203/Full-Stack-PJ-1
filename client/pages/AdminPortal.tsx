import { Home } from 'lucide-react';

export default function AdminPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-300">
            Access control for authorized personnel
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 sm:space-y-4">
          {/* Admin Login */}
          <Link
            to="/admin-login"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium text-base sm:text-lg rounded-full transition-all hover:scale-105 hover:shadow-lg"
          >
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
            Admin Login
          </Link>

          {/* Employee Request */}
          <Link
            to="/admin-signup"
            className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 border-2 border-orange-500 bg-transparent text-orange-500 font-medium text-base sm:text-lg rounded-full transition-all hover:scale-105 hover:bg-orange-500 hover:text-white"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            Request Admin Access
          </Link>
        </div>

        {/* Info */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-medium mb-2">Access Information</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Admin Login: For authorized administrators</li>
            <li>
              • Request Access: Submit employee request for admin privileges
            </li>
            <li>• All requests require super admin approval</li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}