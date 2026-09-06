import React from "react";

interface GeminiIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const GeminiIcon: React.FC<GeminiIconProps> = ({
  className = "w-5 h-5",
  size,
  glow = true,
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 group-hover:scale-110`}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        {/* Multi-stop dimensional color gradient */}
        <linearGradient id="gemini-lux-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="28%" stopColor="#7C3AED" />
          <stop offset="55%" stopColor="#DB2777" />
          <stop offset="82%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Specular inner highlight gradient */}
        <linearGradient id="gemini-highlight" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Subtle radial core glow */}
        <radialGradient id="gemini-core-glow" cx="16" cy="16" r="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#E0E7FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4338CA" stopOpacity="0" />
        </radialGradient>

        {/* Soft bloom drop-shadow filter */}
        <filter id="gemini-bloom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer ambient glow halo */}
      {glow && (
        <path
          d="M16 2C16 9.73199 9.73199 16 2 16C9.73199 16 16 22.268 16 30C16 22.268 22.268 16 30 16C22.268 16 16 9.73199 16 2Z"
          fill="url(#gemini-lux-grad)"
          opacity="0.3"
          filter="url(#gemini-bloom)"
        />
      )}

      {/* Main 4-pointed Gemini Star Body */}
      <path
        d="M16 2.5C16 9.95584 9.95584 16 2.5 16C9.95584 16 16 22.0442 16 29.5C16 22.0442 22.0442 16 29.5 16C22.0442 16 16 9.95584 16 2.5Z"
        fill="url(#gemini-lux-grad)"
      />

      {/* Refined Specular Light Crest (Upper right facet) */}
      <path
        d="M16 2.5C16 9.95584 22.0442 16 29.5 16C22.0442 16 16 9.95584 16 2.5Z"
        fill="url(#gemini-highlight)"
        opacity="0.45"
      />

      {/* Luminous Center Point */}
      <circle cx="16" cy="16" r="3.2" fill="url(#gemini-core-glow)" />

      {/* Secondary Companion Sparkle */}
      <path
        d="M26 4C26 5.65685 24.6569 7 23 7C24.6569 7 26 8.34315 26 10C26 8.34315 27.3431 7 29 7C27.3431 7 26 5.65685 26 4Z"
        fill="#FDE68A"
        opacity="0.9"
      />
    </svg>
  );
};

export const GeminiBadge: React.FC<{ label?: string }> = ({ label = "Gemini 3.8 Flash" }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-purple-200/80 text-[11px] font-semibold text-purple-950 shadow-2xs">
      <GeminiIcon className="w-3.5 h-3.5" glow={false} />
      <span>{label}</span>
    </span>
  );
};

export const AskGeminiButton: React.FC<{
  onClick: () => void;
  className?: string;
  hasReflection?: boolean;
}> = ({ onClick, className = "", hasReflection = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 hover:from-indigo-800 hover:via-purple-800 hover:to-slate-800 text-white text-xs font-semibold shadow-md hover:shadow-indigo-500/25 transition-all duration-200 border border-indigo-400/40 cursor-pointer ${className}`}
    >
      <GeminiIcon className="w-4 h-4 text-purple-300" />
      <span className="tracking-wide">Ask Gemini</span>
      {hasReflection && (
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      )}
    </button>
  );
};
