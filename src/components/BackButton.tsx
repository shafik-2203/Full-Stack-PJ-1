
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center space-x-1 text-sm text-gray-700 hover:text-black"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </button>
  );
}
