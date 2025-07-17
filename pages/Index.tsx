import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 relative overflow-x-hidden">
      {/* Logo */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-5 z-10">
        <Logo size={80} className="sm:hidden" />
        <Logo size={130} className="hidden sm:block" />
      </div>

      {/* Header Navigation */}
      <header className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 z-10 max-w-xs sm:max-w-none">
        {/* Premium Admin Button */}
        <Link
          to="/admin-portal"
          className="group relative flex items-center justify-center w-16 h-8 px-1 py-1 sm:w-24 sm:h-10 sm:px-2 sm:py-1 md:w-32 md:h-12 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border border-gray-700 shadow-2xl text-white font-semibold text-xs sm:text-sm md:text-base transition-all hover:scale-105 hover:shadow-slate-900/50 hover:border-gray-600 overflow-hidden"
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {/* Premium glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-700/20 via-gray-600/30 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Content */}
          <div className="relative flex items-center">
            <span className="text-gray-100 font-bold tracking-wide">Admin</span>
          </div>

          {/* Premium indicator */}
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full"></div>
        </Link>

        <Link
          to="/login"
          className="flex items-center justify-center w-16 h-8 px-1 py-1 sm:w-24 sm:h-10 sm:px-2 sm:py-1 md:w-32 md:h-12 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium text-xs sm:text-sm md:text-base transition-all hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="flex items-center justify-center w-16 h-8 px-1 py-1 sm:w-24 sm:h-10 sm:px-2 sm:py-1 md:w-32 md:h-12 md:px-4 md:py-2 rounded-full border border-orange-500 bg-white text-orange-500 font-medium text-xs sm:text-sm md:text-base transition-all hover:scale-105 hover:bg-orange-50"
        >
          Sign up
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 sm:pt-0">
        {/* Hero Content */}
        <div className="flex flex-col items-center gap-3 sm:gap-5 max-w-xs sm:max-w-md md:max-w-lg text-center">
          {/* Brand Name */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal text-black font-sans tracking-wide">
            FASTIO
          </h1>

          {/* Divider Line */}
          <div className="w-32 sm:w-64 md:w-88 h-px bg-black"></div>

          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-black">
            Fast Moves, Fresh Choices.
          </p>

          {/* Additional tagline */}
          <p className="text-sm sm:text-base md:text-lg text-black/80">
            🚀 Experience lightning-fast food delivery
          </p>
        </div>

        {/* App Download Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-7 mt-10 sm:mt-20">
          <a
            href="https://apps.apple.com/app/zomato-food-delivery-dining/id434613896"
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c341f6a999ef369acd139927b58eea53c555c282?width=400"
              alt="Download on App Store"
              className="h-10 sm:h-12 w-auto flex-shrink-0 filter hover:brightness-110"
            />
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.application.zomato"
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <div className="flex items-center bg-black rounded-lg px-4 py-3 h-10 sm:h-12 min-w-[160px] sm:min-w-[180px] hover:bg-gray-800 transition-colors shadow-lg">
              {/* Google Play Icon */}
              <div className="flex-shrink-0 mr-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 20.5v-17c0-.35.15-.65.39-.84L12 12l-8.61 9.34c-.24-.19-.39-.49-.39-.84z"
                    fill="#EA4335"
                  />
                  <path
                    d="M9.83 12L3.39 3.66c.2-.15.45-.24.72-.24.15 0 .3.03.44.09L20 9.5l-5.5 2.5-4.67-4.67z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M20 9.5c.55 0 1 .45 1 1s-.45 1-1 1l-5.5 2.5L9.83 12 14.5 7.33 20 9.5z"
                    fill="#4285F4"
                  />
                  <path
                    d="M14.5 16.67L9.83 12l4.67-4.67L20 14.5c-.55 0-1 .45-1 1s.45 1 1 1l-5.5 2.17z"
                    fill="#34A853"
                  />
                </svg>
              </div>

              {/* Text Content */}
              <div className="text-white text-left leading-tight">
                <div className="text-xs font-normal opacity-90">Get it on</div>
                <div className="text-sm sm:text-base font-semibold -mt-0.5">
                  Google Play
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Professional Credits Section */}
      <footer className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="text-center px-4">
          <div className="bg-black/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-black/10">
            <p className="text-xs sm:text-sm text-black/70 font-medium mb-1">
              © 2024 FASTIO. All rights reserved.
            </p>
            <p className="text-xs text-black/50">
              Developed by{" "}
              <span className="text-black/70 font-semibold">
                Mohamed Shafik
              </span>{" "}
              • <span className="text-black/60">Full-Stack Developer</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Custom width utility */}
      <style>{`
        .md\\:w-88 {
          width: 22rem;
        }
      `}</style>
    </div>
  );
}
