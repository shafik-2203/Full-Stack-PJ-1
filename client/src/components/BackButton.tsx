import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  variant?: "default" | "light" | "dark";
}

export default function BackButton({
  to,
  label = "Back",
  className = "",
  variant = "default",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "light":
        return "text-white/80 hover:text-white bg-white/10 hover:bg-white/20";
      case "dark":
        return "text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600";
      default:
        return "text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50";
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors touch-manipulation ${getVariantClasses()} ${className}`}
      style={{ minHeight: "44px", minWidth: "44px" }}
    >
      <ArrowLeft size={18} className="sm:w-4 sm:h-4" />
      <span className="text-sm sm:text-sm font-medium">{label}</span>
    </button>
  );
}
