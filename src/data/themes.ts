import { DiaryThemeId } from "../types";

export interface ThemeConfig {
  id: DiaryThemeId;
  name: string;
  tagline: string;
  description: string;
  previewThumbnail: string; // CSS gradient / accent for selector
  // Cover styling
  cover: {
    bg: string;
    border: string;
    spineGradient: string;
    ribbonGradient: string;
    charmDefault: string;
    accentGlow: string;
    label: string;
  };
  // Paper & Inner Book styling
  paper: {
    baseBg: string;
    ruledLine: string;
    gridDot: string;
    textColor: string;
    dateColor: string;
    borderDivider: string;
    pageEdgeGradient: string;
    spineShadow: string;
  };
  // Surrounding Atmosphere
  environment: {
    bgCanvas: string;
    glowOne: string;
    glowTwo: string;
    atmosphereOverlay?: string;
  };
  // Ambient Sound settings
  sound: {
    hasAmbientSound: boolean;
    soundType: "ocean" | "wind" | null;
    label: string;
  };
  // Gemini Note Themed Presentation
  geminiNote: {
    bg: string;
    border: string;
    textColor: string;
    badgeBg: string;
    badgeText: string;
    pinColor: string;
    pinFill: string;
    insightBg: string;
  };
}

export const DIARY_THEMES: Record<DiaryThemeId, ThemeConfig> = {
  classic: {
    id: "classic",
    name: "Classic Diary",
    tagline: "Warm Cream & Antiqued Leather",
    description: "The original timeless journal. Warm cream paper, soft paper imperfections, leather spine, and gentle study lighting.",
    previewThumbnail: "from-[#8B4513] via-[#A0522D] to-[#CD853F]",
    cover: {
      bg: "from-[#4A2E18] via-[#5C3A1E] to-[#3B220F]",
      border: "border-[#8B5A2B]",
      spineGradient: "from-black/50 via-black/20 to-transparent",
      ribbonGradient: "from-rose-500 via-rose-400 to-rose-600",
      charmDefault: "⭐",
      accentGlow: "shadow-amber-900/40",
      label: "Heritage Leather",
    },
    paper: {
      baseBg: "#FFFDF9",
      ruledLine: "#E2DFD2",
      gridDot: "#CBD5E1",
      textColor: "text-slate-900",
      dateColor: "text-amber-900",
      borderDivider: "border-amber-200/60",
      pageEdgeGradient: "from-amber-100 via-amber-50 to-amber-200",
      spineShadow: "from-black/15 via-black/35 to-black/15",
    },
    environment: {
      bgCanvas: "bg-[#FAF7F2]",
      glowOne: "bg-purple-200/25",
      glowTwo: "bg-amber-200/25",
    },
    sound: {
      hasAmbientSound: false,
      soundType: null,
      label: "Quiet Reflection",
    },
    geminiNote: {
      bg: "bg-[#FEF3C7]",
      border: "border-amber-300/80",
      textColor: "text-amber-950",
      badgeBg: "bg-amber-200",
      badgeText: "text-amber-900",
      pinColor: "text-amber-800",
      pinFill: "fill-amber-600",
      insightBg: "bg-white/60",
    },
  },

  peacock: {
    id: "peacock",
    name: "Peacock Feather",
    tagline: "Iridescent Emerald & Deep Teal",
    description: "A sophisticated nature-inspired sanctuary. Deep teal, emerald green, iridescent peacock feather fibers, and luxury gold leaf accents.",
    previewThumbnail: "from-[#0F3838] via-[#0D5C52] to-[#1E8A7A]",
    cover: {
      bg: "from-[#0A2624] via-[#0E3D3A] to-[#081F1D]",
      border: "border-[#1F7A70]",
      spineGradient: "from-black/60 via-[#072421]/40 to-transparent",
      ribbonGradient: "from-emerald-400 via-teal-300 to-emerald-600",
      charmDefault: "🦚",
      accentGlow: "shadow-emerald-950/60",
      label: "Emerald Plumage",
    },
    paper: {
      baseBg: "#F6FBF9",
      ruledLine: "#C2E2DA",
      gridDot: "#88BCB2",
      textColor: "text-[#0A2623]",
      dateColor: "text-teal-950",
      borderDivider: "border-teal-200/70",
      pageEdgeGradient: "from-teal-100 via-emerald-50 to-teal-200",
      spineShadow: "from-teal-950/20 via-teal-950/40 to-teal-950/20",
    },
    environment: {
      bgCanvas: "bg-[#091D1B]",
      glowOne: "bg-teal-500/20",
      glowTwo: "bg-emerald-600/15",
      atmosphereOverlay: "radial-gradient(ellipse at 50% 30%, rgba(13,92,82,0.25) 0%, transparent 70%)",
    },
    sound: {
      hasAmbientSound: false,
      soundType: null,
      label: "Nature Serenity",
    },
    geminiNote: {
      bg: "bg-[#E6F4F1]",
      border: "border-teal-400/70",
      textColor: "text-teal-950",
      badgeBg: "bg-teal-200",
      badgeText: "text-teal-900",
      pinColor: "text-teal-800",
      pinFill: "fill-teal-600",
      insightBg: "bg-white/70",
    },
  },

  ocean: {
    id: "ocean",
    name: "Ocean Calm",
    tagline: "Rolling Surf & Coastal Horizon",
    description: "Write alongside the soothing rhythm of realistic ocean waves and natural coastal sunlight, complete with peaceful ambient surf audio.",
    previewThumbnail: "from-[#1E3A8A] via-[#0284C7] to-[#38BDF8]",
    cover: {
      bg: "from-[#0F2942] via-[#163D61] to-[#0A1F33]",
      border: "border-[#38BDF8]/60",
      spineGradient: "from-black/60 via-[#0C2438]/50 to-transparent",
      ribbonGradient: "from-cyan-400 via-sky-300 to-blue-500",
      charmDefault: "🌊",
      accentGlow: "shadow-sky-950/50",
      label: "Maritime Horizon",
    },
    paper: {
      baseBg: "#FAFDFE",
      ruledLine: "#BFDCF0",
      gridDot: "#88B8CE",
      textColor: "text-[#061E2E]",
      dateColor: "text-sky-950",
      borderDivider: "border-sky-200/80",
      pageEdgeGradient: "from-sky-100 via-cyan-50 to-sky-200",
      spineShadow: "from-sky-950/20 via-sky-950/40 to-sky-950/20",
    },
    environment: {
      bgCanvas: "bg-[#061826]",
      glowOne: "bg-sky-500/20",
      glowTwo: "bg-cyan-600/15",
      atmosphereOverlay: "linear-gradient(to top, rgba(2,132,199,0.18), transparent 70%)",
    },
    sound: {
      hasAmbientSound: true,
      soundType: "ocean",
      label: "Ocean Waves Surf",
    },
    geminiNote: {
      bg: "bg-[#E0F2FE]",
      border: "border-sky-300/80",
      textColor: "text-sky-950",
      badgeBg: "bg-sky-200",
      badgeText: "text-sky-900",
      pinColor: "text-sky-800",
      pinFill: "fill-sky-600",
      insightBg: "bg-white/70",
    },
  },

  galaxy: {
    id: "galaxy",
    name: "Galaxy Night",
    tagline: "Starlight Sky & Celestial Nebula",
    description: "A private journal under a deep midnight starry sky. Procedural twinkling stars, subtle cosmic nebula dust, and moonlight illumination.",
    previewThumbnail: "from-[#090D16] via-[#1E1B4B] to-[#312E81]",
    cover: {
      bg: "from-[#080B14] via-[#13152C] to-[#05070D]",
      border: "border-[#6366F1]/50",
      spineGradient: "from-black/70 via-[#10132C]/60 to-transparent",
      ribbonGradient: "from-indigo-400 via-purple-300 to-indigo-600",
      charmDefault: "🌙",
      accentGlow: "shadow-indigo-950/70",
      label: "Cosmic Velvet",
    },
    paper: {
      baseBg: "#FCFDFE",
      ruledLine: "#D1C8EC",
      gridDot: "#A399D5",
      textColor: "text-[#0C0825]",
      dateColor: "text-indigo-950",
      borderDivider: "border-indigo-200/70",
      pageEdgeGradient: "from-indigo-100 via-purple-50 to-indigo-200",
      spineShadow: "from-indigo-950/25 via-indigo-950/50 to-indigo-950/25",
    },
    environment: {
      bgCanvas: "bg-[#04060B]",
      glowOne: "bg-indigo-600/20",
      glowTwo: "bg-purple-700/15",
      atmosphereOverlay: "radial-gradient(circle at 60% 40%, rgba(99,102,241,0.15) 0%, transparent 60%)",
    },
    sound: {
      hasAmbientSound: false,
      soundType: null,
      label: "Cosmic Serenade",
    },
    geminiNote: {
      bg: "bg-[#EDE9FE]",
      border: "border-indigo-300/80",
      textColor: "text-indigo-950",
      badgeBg: "bg-indigo-200",
      badgeText: "text-indigo-900",
      pinColor: "text-indigo-800",
      pinFill: "fill-indigo-600",
      insightBg: "bg-white/70",
    },
  },

  windy_leaves: {
    id: "windy_leaves",
    name: "Windy Leaves",
    tagline: "Forest Breeze & Falling Foliage",
    description: "Crisp natural woods with realistic drifting leaves moving organically through the air with wind gusts and 3D tumbling rotation.",
    previewThumbnail: "from-[#3E2723] via-[#5D4037] to-[#D97706]",
    cover: {
      bg: "from-[#2C1D11] via-[#3D2919] to-[#20140A]",
      border: "border-[#B45309]/60",
      spineGradient: "from-black/60 via-[#27190F]/50 to-transparent",
      ribbonGradient: "from-amber-500 via-orange-400 to-amber-600",
      charmDefault: "🍃",
      accentGlow: "shadow-amber-950/50",
      label: "Autumn Oak",
    },
    paper: {
      baseBg: "#FCFAF6",
      ruledLine: "#D8CCA8",
      gridDot: "#B8A880",
      textColor: "text-[#1B1006]",
      dateColor: "text-amber-950",
      borderDivider: "border-amber-300/60",
      pageEdgeGradient: "from-amber-100 via-orange-50 to-amber-200",
      spineShadow: "from-stone-950/20 via-stone-950/40 to-stone-950/20",
    },
    environment: {
      bgCanvas: "bg-[#18120B]",
      glowOne: "bg-amber-600/18",
      glowTwo: "bg-orange-700/12",
      atmosphereOverlay: "linear-gradient(135deg, rgba(180,83,9,0.12) 0%, transparent 60%)",
    },
    sound: {
      hasAmbientSound: true,
      soundType: "wind",
      label: "Gentle Wind Breeze",
    },
    geminiNote: {
      bg: "bg-[#FEF3C7]",
      border: "border-amber-400/80",
      textColor: "text-amber-950",
      badgeBg: "bg-amber-200",
      badgeText: "text-amber-900",
      pinColor: "text-amber-800",
      pinFill: "fill-amber-600",
      insightBg: "bg-white/70",
    },
  },
};
