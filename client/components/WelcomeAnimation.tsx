import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface WelcomeAnimationProps {
  username: string;
  onComplete: () => void;
}

export default function WelcomeAnimation({
  username,
  onComplete,
}: WelcomeAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: "🎉",
      title: "Welcome to FASTIO!",
      subtitle: `Hi ${username}! Your account has been created successfully.`,
      color: "from-orange-500 to-red-500",
    },
    {
      icon: "🍽️",
      title: "Discover Amazing Food",
      subtitle: "Explore restaurants and dishes from your favorite cuisines.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "⚡",
      title: "Fast Delivery",
      subtitle: "Get your food delivered quickly to your doorstep.",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: "🎁",
      title: "Exclusive Benefits",
      subtitle: "Enjoy special offers and rewards as a FASTIO member.",
      color: "from-purple-500 to-pink-500",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Animation complete, redirect to dashboard
        setTimeout(() => {
          onComplete();
          navigate("/dashboard");
        }, 2000);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [currentStep, steps.length, onComplete, navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center z-50">
      <div className="text-center px-8">
        {/* Main Animation Container */}
        <div className="relative">
          {/* Animated Background Circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-white/10 animate-pulse"></div>
            <div className="w-48 h-48 rounded-full bg-white/20 absolute animate-ping"></div>
            <div className="w-32 h-32 rounded-full bg-white/30 absolute animate-bounce"></div>
          </div>

          {/* Step Content */}
          <div className="relative z-10 transform transition-all duration-500 ease-in-out">
            {/* Large Icon with Animation */}
            <div className="text-8xl mb-6 animate-bounce">
              {steps[currentStep].icon}
            </div>

            {/* Title with Slide Animation */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-up">
              {steps[currentStep].title}
            </h1>

            {/* Subtitle with Fade Animation */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
              {steps[currentStep].subtitle}
            </p>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-3 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-white scale-125"
                      : index < currentStep
                        ? "bg-white/60"
                        : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Loading Bar */}
            <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-2500 ease-out"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>

            {/* Skip Button (appears after first step) */}
            {currentStep > 0 && (
              <button
                onClick={() => {
                  onComplete();
                  navigate("/dashboard");
                }}
                className="mt-8 px-6 py-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-300 animate-fade-in"
              >
                Skip Introduction →
              </button>
            )}
          </div>
        </div>

        {/* Footer Text */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/60 text-sm">
            Setting up your personalized experience...
          </p>
        </div>
      </div>

      {/* Floating Food Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-float-slow">
          🍕
        </div>
        <div className="absolute top-32 right-16 text-3xl animate-float-delayed">
          🍔
        </div>
        <div className="absolute bottom-32 left-20 text-3xl animate-float">
          🍜
        </div>
        <div className="absolute bottom-20 right-12 text-4xl animate-float-slow">
          🍣
        </div>
        <div className="absolute top-1/2 left-8 text-2xl animate-float-delayed">
          🌮
        </div>
        <div className="absolute top-1/3 right-8 text-2xl animate-float">
          🍰
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(-40px);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3.5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
