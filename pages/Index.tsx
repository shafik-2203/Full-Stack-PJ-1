import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Index() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div
          className={`absolute inset-0 transition-all duration-3000 ease-out ${
            animationStage >= 1
              ? "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 opacity-100"
              : "bg-gradient-to-br from-black via-gray-900 to-black opacity-80"
          }`}
        />

        {/* Animated overlay patterns */}
        <div
          className={`absolute inset-0 transition-all duration-2000 ${
            animationStage >= 2 ? "opacity-30" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </div>

        {/* Floating geometric shapes */}
        {animationStage >= 2 && (
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute animate-float"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${4 + Math.random() * 2}s`,
                }}
              >
                <div className="w-3 h-3 bg-white/20 rounded-full blur-sm" />
              </div>
            ))}
          </div>
        )}

        {/* Radial gradient overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-2000 ${
            animationStage >= 3 ? "opacity-20" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Spectacular Logo Animation */}
      <div
        className={`absolute top-2 left-2 sm:top-4 sm:left-5 z-10 transition-all duration-1500 ease-out ${
          animationStage >= 2
            ? "transform translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100"
            : "transform -translate-x-32 -translate-y-20 scale-75 rotate-45 opacity-0"
        }`}
      >
        <div
          className={`transition-all duration-1000 ${animationStage >= 2 ? "animate-glow" : ""}`}
        >
          <Logo size={80} className="sm:hidden drop-shadow-2xl" />
          <Logo size={130} className="hidden sm:block drop-shadow-2xl" />
        </div>
      </div>

      {/* Header Navigation with Wave Animation */}
      <header
        className={`absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 z-10 max-w-xs sm:max-w-none transition-all duration-1500 ${
          animationStage >= 4
            ? "transform translate-x-0 translate-y-0 opacity-100"
            : "transform translate-x-full -translate-y-8 opacity-0"
        }`}
      >
        {/* Premium Admin Button */}
        <Link
          to="/admin-portal"
          className="group relative flex items-center justify-center w-16 h-8 px-1 py-1 sm:w-24 sm:h-10 sm:px-2 sm:py-1 md:w-32 md:h-12 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border border-gray-700 shadow-2xl text-white font-semibold text-xs sm:text-sm md:text-base transition-all hover:scale-105 hover:shadow-slate-900/50 hover:border-gray-600 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-700/20 via-gray-600/30 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <span className="text-gray-100 font-bold tracking-wide">Admin</span>
          </div>
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

      {/* Main Content with Morphing Animations */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 sm:pt-0">
        <div className="flex flex-col items-center gap-3 sm:gap-5 max-w-xs sm:max-w-md md:max-w-lg text-center">
          {/* Brand Name with Typewriter Effect */}
          <div
            className={`relative transition-all duration-2000 ease-out ${
              animationStage >= 3
                ? "transform translate-y-0 scale-100 opacity-100"
                : "transform translate-y-32 scale-75 opacity-0"
            }`}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal text-black font-sans tracking-wide relative">
              <span className="relative inline-block">
                {"FASTIO".split("").map((letter, index) => (
                  <span
                    key={index}
                    className={`inline-block transition-all duration-700 ${
                      animationStage >= 3
                        ? "transform translate-y-0 rotate-0 opacity-100"
                        : "transform translate-y-12 rotate-12 opacity-0"
                    }`}
                    style={{
                      transitionDelay: `${animationStage >= 3 ? index * 150 : 0}ms`,
                      textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    {letter}
                  </span>
                ))}
                {/* Animated cursor */}
                <span
                  className={`inline-block w-1 bg-black transition-opacity duration-500 ${
                    animationStage >= 3 ? "animate-blink" : "opacity-0"
                  }`}
                  style={{ height: "0.8em", marginLeft: "0.1em" }}
                />
              </span>
            </h1>

            {/* Dynamic underline */}
            <div
              className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-1500 ${
                animationStage >= 3
                  ? "w-full h-2 bg-gradient-to-r from-orange-400 via-black to-orange-400 opacity-60 scale-x-100"
                  : "w-0 h-2 bg-black opacity-0 scale-x-0"
              }`}
              style={{ borderRadius: "2px" }}
            />
          </div>

          {/* Elegant Divider */}
          <div
            className={`transition-all duration-1500 ${
              animationStage >= 3
                ? "w-32 sm:w-64 md:w-88 h-px bg-gradient-to-r from-transparent via-black to-transparent transform scale-x-100 opacity-100"
                : "w-0 h-px bg-black transform scale-x-0 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          />

          {/* Taglines with Cascade Effect */}
          <div className="space-y-2">
            <p
              className={`text-lg sm:text-xl md:text-2xl font-medium text-black transition-all duration-1200 ${
                animationStage >= 3
                  ? "transform translate-y-0 opacity-100"
                  : "transform translate-y-8 opacity-0"
              }`}
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                transitionDelay: "900ms",
              }}
            >
              Fast Moves, Fresh Choices.
            </p>

            <p
              className={`text-sm sm:text-base md:text-lg text-black/80 transition-all duration-1200 ${
                animationStage >= 3
                  ? "transform translate-y-0 opacity-100"
                  : "transform translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: "1200ms",
              }}
            >
              <span className="inline-block animate-bounce-slow">🚀</span>{" "}
              Experience lightning-fast food delivery
            </p>
          </div>
        </div>

        {/* App Download Buttons with Improved Design */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-7 mt-10 sm:mt-20 transition-all duration-1500 ${
            showContent
              ? "transform translate-y-0 opacity-100"
              : "transform translate-y-16 opacity-0"
          }`}
        >
          {/* App Store Button */}
          <a
            href="https://apps.apple.com/app/zomato-food-delivery-dining/id434613896"
            target="_blank"
            rel="noopener noreferrer"
            className={`block transition-all duration-700 hover:scale-110 hover:shadow-2xl group ${
              showContent
                ? "transform translate-x-0 rotate-0 opacity-100"
                : "transform -translate-x-20 rotate-12 opacity-0"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/c341f6a999ef369acd139927b58eea53c555c282?width=400"
              alt="Download on App Store"
              className="h-12 sm:h-14 w-auto flex-shrink-0 filter group-hover:brightness-110 drop-shadow-xl rounded-lg"
            />
          </a>

          {/* Google Play Button - Custom Design */}
          <a
            href="https://play.google.com/store/apps/details?id=com.application.zomato"
            target="_blank"
            rel="noopener noreferrer"
            className={`block transition-all duration-700 hover:scale-110 hover:shadow-2xl group ${
              showContent
                ? "transform translate-x-0 rotate-0 opacity-100"
                : "transform translate-x-20 rotate-12 opacity-0"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            <div className="flex items-center bg-black rounded-lg p-3 h-12 sm:h-14 min-w-[140px] sm:min-w-[160px] group-hover:bg-gray-800 transition-colors shadow-xl">
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
              <div className="text-white text-left">
                <div className="text-xs font-normal leading-none">
                  GET IT ON
                </div>
                <div className="text-lg font-semibold leading-tight -mt-0.5">
                  Google Play
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer
        className={`absolute bottom-4 left-0 right-0 flex justify-center transition-all duration-2000 ${
          showContent
            ? "transform translate-y-0 opacity-100"
            : "transform translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "1500ms" }}
      >
        <div className="text-center px-4">
          <div className="bg-black/10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-black/20 shadow-2xl">
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

      {/* Enhanced Custom Styles */}
      <style>{`
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% { 
            transform: translateY(-10px) translateX(5px) rotate(90deg);
          }
          50% { 
            transform: translateY(-20px) translateX(-5px) rotate(180deg);
          }
          75% { 
            transform: translateY(-10px) translateX(5px) rotate(270deg);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            filter: drop-shadow(0 0 10px rgba(255,165,0,0.3));
          }
          50% { 
            filter: drop-shadow(0 0 20px rgba(255,165,0,0.6));
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float {
          animation: float 6s infinite linear;
        }
        
        .animate-glow {
          animation: glow 3s infinite;
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        
        .md\\:w-88 {
          width: 22rem;
        }
      `}</style>
    </div>
  );
}
