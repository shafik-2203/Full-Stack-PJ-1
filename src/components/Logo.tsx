import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 56, className = "" }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2F75c816161b7642a7a688a4c51e7093dc%2Fa48e4e6496a54cfa82fc1f1d745eb669?format=webp&width=800"
        alt="FASTIO Logo"
        className="w-full h-full object-contain"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
