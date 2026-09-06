import React from "react";

export interface StickerDefinition {
  id: string;
  name: string;
  category: "flowers" | "celestial" | "cute" | "study" | "travel" | "stationery";
  render: () => React.ReactNode;
}

export const STICKER_CATEGORIES: { id: StickerDefinition["category"]; label: string; icon: string }[] = [
  { id: "flowers", label: "Flowers & Nature", icon: "🌸" },
  { id: "celestial", label: "Stars & Dreamy", icon: "✨" },
  { id: "cute", label: "Cute & Bows", icon: "🎀" },
  { id: "study", label: "Study & Focus", icon: "📚" },
  { id: "travel", label: "Travel & Wander", icon: "✈️" },
  { id: "stationery", label: "Tape & Seals", icon: "📎" },
];

export const STICKERS: StickerDefinition[] = [
  // Flowers & Nature
  {
    id: "cherry_blossom",
    name: "Cherry Blossom",
    category: "flowers",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="10" fill="#FFE4E6" />
        <ellipse cx="50" cy="24" rx="13" ry="18" fill="#FDA4AF" opacity="0.9" />
        <ellipse cx="74" cy="42" rx="18" ry="13" fill="#FDA4AF" opacity="0.9" />
        <ellipse cx="65" cy="74" rx="14" ry="18" fill="#FDA4AF" opacity="0.9" />
        <ellipse cx="35" cy="74" rx="14" ry="18" fill="#FDA4AF" opacity="0.9" />
        <ellipse cx="26" cy="42" rx="18" ry="13" fill="#FDA4AF" opacity="0.9" />
        <circle cx="50" cy="50" r="7" fill="#F43F5E" />
        <circle cx="50" cy="50" r="3" fill="#FFF1F2" />
      </svg>
    ),
  },
  {
    id: "rose_pressed",
    name: "Pressed Rose",
    category: "flowers",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 30 C40 15, 20 25, 30 45 C40 60, 50 75, 50 85 C50 75, 60 60, 70 45 C80 25, 60 15, 50 30 Z" fill="#E11D48" opacity="0.85" />
        <circle cx="50" cy="42" r="12" fill="#BE123C" />
        <path d="M50 85 Q48 95 45 98" stroke="#15803D" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M48 88 Q35 85 40 78 Q48 82 48 88 Z" fill="#16A34A" />
      </svg>
    ),
  },
  {
    id: "chamomile",
    name: "Chamomile",
    category: "flowers",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="22" fill="#FBBF24" />
        <circle cx="50" cy="50" r="16" fill="#F59E0B" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={deg}
            cx="50"
            cy="15"
            rx="8"
            ry="15"
            fill="#FFFFFF"
            stroke="#FEF3C7"
            strokeWidth="1"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="12" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    id: "eucalyptus_sprig",
    name: "Eucalyptus",
    category: "flowers",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M20 85 Q50 50 80 15" stroke="#065F46" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="35" cy="70" rx="10" ry="14" fill="#6EE7B7" transform="rotate(-30 35 70)" opacity="0.9" />
        <ellipse cx="45" cy="58" rx="11" ry="15" fill="#34D399" transform="rotate(40 45 58)" opacity="0.9" />
        <ellipse cx="60" cy="40" rx="10" ry="13" fill="#6EE7B7" transform="rotate(-20 60 40)" opacity="0.9" />
        <ellipse cx="72" cy="26" rx="9" ry="12" fill="#34D399" transform="rotate(35 72 26)" opacity="0.9" />
      </svg>
    ),
  },

  // Celestial & Dreamy
  {
    id: "star_gold",
    name: "Golden Star",
    category: "celestial",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <polygon
          points="50,5 64,36 98,38 72,60 80,94 50,75 20,94 28,60 2,38 36,36"
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth="2"
        />
        <circle cx="50" cy="50" r="10" fill="#FEF3C7" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "moon_crescent",
    name: "Crescent Moon",
    category: "celestial",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path
          d="M60 15 A40 40 0 1 0 75 75 A32 32 0 1 1 60 15 Z"
          fill="#FDE68A"
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <circle cx="35" cy="35" r="3" fill="#F59E0B" opacity="0.4" />
        <circle cx="45" cy="65" r="4" fill="#F59E0B" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "sparkle_magic",
    name: "Magic Sparkles",
    category: "celestial",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 10 Q50 50 90 50 Q50 50 50 90 Q50 50 10 50 Q50 50 50 10 Z" fill="#818CF8" />
        <path d="M75 20 Q75 35 90 35 Q75 35 75 50 Q75 35 60 35 Q75 35 75 20 Z" fill="#C084FC" />
        <circle cx="28" cy="72" r="4" fill="#F472B6" />
        <circle cx="70" cy="80" r="3" fill="#38BDF8" />
      </svg>
    ),
  },
  {
    id: "dream_cloud",
    name: "Dreamy Cloud",
    category: "celestial",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path
          d="M25 65 A18 18 0 0 1 35 32 A24 24 0 0 1 70 30 A20 20 0 0 1 82 55 A15 15 0 0 1 78 68 Z"
          fill="#E0E7FF"
          stroke="#C7D2FE"
          strokeWidth="2"
        />
        <ellipse cx="45" cy="45" rx="8" ry="4" fill="#FFFFFF" opacity="0.8" />
      </svg>
    ),
  },

  // Cute & Bows
  {
    id: "satin_bow",
    name: "Satin Bow",
    category: "cute",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 45 C40 30, 15 30, 20 50 C25 65, 45 55, 50 48 Z" fill="#F472B6" />
        <path d="M50 45 C60 30, 85 30, 80 50 C75 65, 55 55, 50 48 Z" fill="#F472B6" />
        <path d="M48 48 C42 65, 30 80, 25 88 C32 82, 45 70, 49 52 Z" fill="#EC4899" />
        <path d="M52 48 C58 65, 70 80, 75 88 C68 82, 55 70, 51 52 Z" fill="#EC4899" />
        <circle cx="50" cy="48" r="7" fill="#DB2777" />
      </svg>
    ),
  },
  {
    id: "pastel_heart",
    name: "Pastel Heart",
    category: "cute",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path
          d="M50 82 C20 60, 10 40, 22 25 C34 10, 48 20, 50 30 C52 20, 66 10, 78 25 C90 40, 80 60, 50 82 Z"
          fill="#FDA4AF"
          stroke="#F43F5E"
          strokeWidth="2"
        />
        <ellipse cx="38" cy="30" rx="6" ry="3" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 38 30)" />
      </svg>
    ),
  },
  {
    id: "coffee_cup",
    name: "Cozy Coffee",
    category: "cute",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="25" y="38" width="45" height="42" rx="10" fill="#F59E0B" />
        <path d="M70 45 Q85 45 85 58 Q85 70 70 70" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="47" cy="38" rx="22" ry="7" fill="#78350F" />
        <path d="M38 28 Q42 20 40 12" stroke="#D97706" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M52 26 Q56 18 54 10" stroke="#D97706" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },

  // Study & Coding
  {
    id: "vintage_books",
    name: "Book Stack",
    category: "study",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="18" y="65" width="64" height="15" rx="3" fill="#0284C7" />
        <rect x="22" y="67" width="8" height="11" fill="#E0F2FE" />
        <rect x="22" y="48" width="56" height="14" rx="3" fill="#D97706" />
        <rect x="26" y="50" width="7" height="10" fill="#FEF3C7" />
        <rect x="26" y="32" width="48" height="13" rx="3" fill="#059669" />
        <rect x="30" y="34" width="6" height="9" fill="#D1FAE5" />
      </svg>
    ),
  },
  {
    id: "laptop_code",
    name: "Hacker Laptop",
    category: "study",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="20" y="28" width="60" height="40" rx="4" fill="#334155" stroke="#64748B" strokeWidth="2" />
        <rect x="25" y="33" width="50" height="30" fill="#0F172A" />
        <text x="30" y="52" fill="#38BDF8" fontSize="14" fontFamily="monospace" fontWeight="bold">&lt;/&gt;</text>
        <path d="M10 70 L90 70 L80 80 L20 80 Z" fill="#94A3B8" />
      </svg>
    ),
  },
  {
    id: "lightbulb_idea",
    name: "Spark of Idea",
    category: "study",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M50 15 C35 15 25 28 25 42 C25 55 35 62 38 72 L62 72 C65 62 75 55 75 42 C75 28 65 15 50 15 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
        <rect x="40" y="74" width="20" height="8" rx="2" fill="#94A3B8" />
        <path d="M45 84 L55 84" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="40" r="10" fill="#FEF08A" opacity="0.8" />
      </svg>
    ),
  },

  // Travel & Adventure
  {
    id: "vintage_camera",
    name: "Vintage Camera",
    category: "travel",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="18" y="35" width="64" height="42" rx="6" fill="#475569" />
        <rect x="24" y="26" width="18" height="9" rx="2" fill="#94A3B8" />
        <circle cx="50" cy="56" r="16" fill="#1E293B" stroke="#94A3B8" strokeWidth="4" />
        <circle cx="50" cy="56" r="8" fill="#38BDF8" />
        <circle cx="70" cy="44" r="4" fill="#EF4444" />
      </svg>
    ),
  },
  {
    id: "paper_airplane",
    name: "Paper Airplane",
    category: "travel",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <polygon points="15,48 85,15 52,85 45,55" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
        <polygon points="45,55 85,15 52,85" fill="#CBD5E1" />
        <path d="M12 65 Q20 72 28 68 Q36 64 42 70" stroke="#94A3B8" strokeDasharray="3 3" fill="none" strokeWidth="2" />
      </svg>
    ),
  },

  // Stationery & Tape
  {
    id: "washi_tape_pastel",
    name: "Pastel Washi Tape",
    category: "stationery",
    render: () => (
      <svg viewBox="0 0 120 40" className="w-full h-full drop-shadow-sm">
        <polygon points="5,5 115,8 112,32 3,30" fill="#BAE6FD" opacity="0.8" />
        <line x1="15" y1="5" x2="25" y2="30" stroke="#7DD3FC" strokeWidth="2" strokeDasharray="2 2" />
        <line x1="40" y1="5" x2="50" y2="30" stroke="#7DD3FC" strokeWidth="2" strokeDasharray="2 2" />
        <line x1="65" y1="5" x2="75" y2="30" stroke="#7DD3FC" strokeWidth="2" strokeDasharray="2 2" />
        <line x1="90" y1="5" x2="100" y2="30" stroke="#7DD3FC" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    id: "washi_tape_floral",
    name: "Blush Tape",
    category: "stationery",
    render: () => (
      <svg viewBox="0 0 120 40" className="w-full h-full drop-shadow-sm">
        <polygon points="4,6 116,4 113,34 6,32" fill="#FBCFE8" opacity="0.85" />
        <circle cx="25" cy="18" r="4" fill="#F472B6" />
        <circle cx="60" cy="18" r="4" fill="#F472B6" />
        <circle cx="95" cy="18" r="4" fill="#F472B6" />
      </svg>
    ),
  },
  {
    id: "brass_paperclip",
    name: "Brass Paperclip",
    category: "stationery",
    render: () => (
      <svg viewBox="0 0 50 100" className="w-full h-full drop-shadow-md">
        <path
          d="M15 80 L15 25 A12 12 0 0 1 39 25 L39 70 A8 8 0 0 1 23 70 L23 35 A4 4 0 0 1 31 35 L31 65"
          fill="none"
          stroke="#D97706"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "gold_wax_seal",
    name: "Gold Wax Seal",
    category: "stationery",
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <path
          d="M50 10 C62 8 72 15 80 25 C88 35 92 48 88 60 C84 72 75 82 62 88 C50 92 38 88 28 80 C18 72 10 60 12 48 C15 35 25 22 35 15 C42 10 45 10 50 10 Z"
          fill="#D97706"
        />
        <circle cx="50" cy="50" r="26" fill="#B45309" />
        <circle cx="50" cy="50" r="22" fill="#D97706" stroke="#FDE68A" strokeWidth="1" />
        <text x="50" y="58" textAnchor="middle" fill="#FEF3C7" fontSize="22" fontFamily="serif" fontWeight="bold">✨</text>
      </svg>
    ),
  },
];
