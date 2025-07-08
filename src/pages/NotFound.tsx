import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-8xl font-bold text-primary-500 mb-4 animate-bounce-slow">
          404
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-slide-up">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 animate-slide-up delay-100">
          The page you're looking for seems to have wandered off. Let's get you
          back on track!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-all duration-200 transform hover:scale-105"
          >
            <Home size={20} />
            <span>Go Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}