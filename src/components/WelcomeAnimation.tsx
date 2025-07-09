import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface WelcomeAnimationProps {
  userName: string;
  onComplete: () => void;
}

export default function WelcomeAnimation({
  userName,
  onComplete,
}: WelcomeAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center z-50">
      <div className="text-center text-white animate-fade-in">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 mx-auto mb-4 animate-bounce" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-in-left">
          Welcome!
        </h1>
        <p className="text-xl md:text-2xl font-medium animate-slide-in-right">
          Hello {userName}, let's get you started with FASTIO
        </p>
        <div className="mt-8">
          <div className="w-16 h-1 bg-white/30 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
