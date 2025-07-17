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
            <svg
              viewBox="0 0 200 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 sm:h-12 w-auto flex-shrink-0 filter hover:brightness-110"
            >
              <path
                d="M192.593 60H7.40741C3.33519 60 0 56.6231 0 52.5V7.5C0 3.37687 3.33519 0 7.40741 0H192.593C196.665 0 200 3.37687 200 7.5V52.5C200 56.6231 196.665 60 192.593 60Z"
                fill="black"
              />
              <path
                d="M192.593 1.20187C196.022 1.20187 198.813 4.0275 198.813 7.5V52.5C198.813 55.9725 196.022 58.7981 192.593 58.7981H7.40741C3.97778 58.7981 1.18704 55.9725 1.18704 52.5V7.5C1.18704 4.0275 3.97778 1.20187 7.40741 1.20187H192.593ZM192.593 0H7.40741C3.33519 0 0 3.37687 0 7.5V52.5C0 56.6231 3.33519 60 7.40741 60H192.593C196.665 60 200 56.6231 200 52.5V7.5C200 3.37687 196.665 0 192.593 0Z"
                fill="#A6A6A6"
              />
              <path
                d="M15.4593 11.3082C15.0241 11.7694 14.7722 12.4875 14.7722 13.4175V46.59C14.7722 47.52 15.0241 48.2382 15.4593 48.6994L15.5667 48.8007L33.9259 30.2194V29.7807L15.5667 11.1994L15.4593 11.3082Z"
                fill="url(#paint0_linear_google)"
              />
              <path
                d="M40.0389 36.4163L33.9259 30.2194V29.7806L40.0463 23.5838L40.1833 23.6644L47.4315 27.84C49.5 29.025 49.5 30.975 47.4315 32.1675L40.1833 36.3356L40.0389 36.4163Z"
                fill="url(#paint1_linear_google)"
              />
              <path
                d="M40.1833 36.3356L33.9259 30L15.4593 48.6994C16.1463 49.4306 17.2667 49.5188 18.5407 48.7875L40.1833 36.3356Z"
                fill="url(#paint2_linear_google)"
              />
              <path
                d="M40.1833 23.6644L18.5407 11.2125C17.2667 10.4888 16.1463 10.5769 15.4593 11.3081L33.9259 30L40.1833 23.6644Z"
                fill="url(#paint3_linear_google)"
              />
              <path
                d="M70.2481 15.3656C70.2481 16.6181 69.8778 17.6212 69.1481 18.3694C68.3092 19.2562 67.2166 19.7025 65.8778 19.7025C64.5981 19.7025 63.5055 19.2487 62.6092 18.3544C61.7111 17.4469 61.2629 16.3331 61.2629 15C61.2629 13.6669 61.7111 12.5531 62.6092 11.6531C63.5055 10.7512 64.5981 10.2975 65.8778 10.2975C66.5148 10.2975 67.1222 10.4306 67.7018 10.6781C68.2796 10.9275 68.75 11.265 69.0907 11.6812L68.3166 12.4725C67.7222 11.7619 66.9129 11.4112 65.8778 11.4112C64.9444 11.4112 64.1352 11.7412 63.4481 12.4069C62.7685 13.0744 62.4278 13.9387 62.4278 15C62.4278 16.0612 62.7685 16.9331 63.4481 17.6006C64.1352 18.2587 64.9444 18.5962 65.8778 18.5962C66.8685 18.5962 67.7018 18.2587 68.3592 17.5931C68.7926 17.1525 69.0389 16.545 69.1037 15.7687H65.8778V14.685H70.1815C70.2333 14.9194 70.2481 15.1462 70.2481 15.3656Z"
                fill="white"
                stroke="white"
                strokeWidth="0.16"
                strokeMiterlimit="10"
              />
              <path
                d="M77.0759 11.6081H73.0333V14.4581H76.6777V15.5418H73.0333V18.3918H77.0759V19.4962H71.8889V10.5037H77.0759V11.6081Z"
                fill="white"
                stroke="white"
                strokeWidth="0.16"
                strokeMiterlimit="10"
              />
              <path
                d="M81.8944 19.4962H80.75V11.6081H78.2703V10.5037H84.3759V11.6081H81.8944V19.4962Z"
                fill="white"
                stroke="white"
                strokeWidth="0.16"
                strokeMiterlimit="10"
              />
              <path
                d="M88.7944 19.4962V10.5037H89.937V19.4962H88.7944Z"
                fill="white"
                stroke="white"
                strokeWidth="0.16"
                strokeMiterlimit="10"
              />
              <path
                d="M95.0018 19.4962H93.8666V11.6081H91.3777V10.5037H97.4907V11.6081H95.0018V19.4962Z"
                fill="white"
                stroke="white"
                strokeWidth="0.16"
                strokeMiterlimit="10"
              />
              <path
                d="M109.05 18.3394C108.174 19.2487 107.089 19.7025 105.794 19.7025C104.493 19.7025 103.407 19.2487 102.531 18.3394C101.657 17.4319 101.222 16.3181 101.222 15C101.222 13.6819 101.657 12.5681 102.531 11.6606C103.407 10.7512 104.493 10.2975 105.794 10.2975C107.081 10.2975 108.167 10.7512 109.043 11.6681C109.924 12.5831 110.359 13.6894 110.359 15C110.359 16.3181 109.924 17.4319 109.05 18.3394ZM103.378 17.5856C104.037 18.2587 104.839 18.5962 105.794 18.5962C106.743 18.5962 107.552 18.2587 108.204 17.5856C108.861 16.9125 109.194 16.0481 109.194 15C109.194 13.9519 108.861 13.0875 108.204 12.4144C107.552 11.7412 106.743 11.4037 105.794 11.4037C104.839 11.4037 104.037 11.7412 103.378 12.4144C102.72 13.0875 102.387 13.9519 102.387 15C102.387 16.0481 102.72 16.9125 103.378 17.5856Z"
                fill="white"
                stroke="white"
                strokeWidth="0.16"
                strokeMiterlimit="10"
              />
              <path
                d="M111.965 19.4962V10.5037H113.354L117.672 17.4975H117.722L117.672 15.7687V10.5037H118.815V19.4962H117.622L113.1 12.1575H113.05L113.1 13.8937V19.4962H111.965Z"
                fill="white"
                stroke="white"
                strokeWidth="0.16"
                strokeMiterlimit="10"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_google"
                  x1="32.2959"
                  y1="46.9355"
                  x2="7.12421"
                  y2="22.0746"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00A0FF" />
                  <stop offset="0.0066" stopColor="#00A1FF" />
                  <stop offset="0.2601" stopColor="#00BEFF" />
                  <stop offset="0.5122" stopColor="#00D2FF" />
                  <stop offset="0.7604" stopColor="#00DFFF" />
                  <stop offset="1" stopColor="#00E3FF" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_google"
                  x1="50.125"
                  y1="29.9979"
                  x2="14.2778"
                  y2="29.9979"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFE000" />
                  <stop offset="0.4087" stopColor="#FFBD00" />
                  <stop offset="0.7754" stopColor="#FFA500" />
                  <stop offset="1" stopColor="#FF9C00" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_google"
                  x1="36.7807"
                  y1="26.5559"
                  x2="2.64592"
                  y2="-7.15752"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF3A44" />
                  <stop offset="1" stopColor="#C31162" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_google"
                  x1="10.8108"
                  y1="59.7357"
                  x2="26.0535"
                  y2="44.6813"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#32A071" />
                  <stop offset="0.0685" stopColor="#2DA771" />
                  <stop offset="0.4762" stopColor="#15CF74" />
                  <stop offset="0.8009" stopColor="#06E775" />
                  <stop offset="1" stopColor="#00F076" />
                </linearGradient>
              </defs>
            </svg>
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
