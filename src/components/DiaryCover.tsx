import React, { useState } from "react";
import { BookOpen, Sparkles, Palette, Feather } from "lucide-react";
import { CoverConfig, JournalEntry, DiaryThemeId } from "../types";
import { DIARY_THEMES } from "../data/themes";

interface DiaryCoverProps {
  displayName: string;
  coverConfig?: CoverConfig;
  entriesCount: number;
  latestEntry?: JournalEntry | null;
  themeId?: DiaryThemeId;
  onOpenDiary: () => void;
  onUpdateCoverConfig: (config: CoverConfig) => Promise<void>;
  onOpenThemeSelector?: () => void;
  onOpenThemesModal?: () => void;
}

const COLOR_THEMES = {
  blush: {
    bg: "from-[#F472B6] via-[#EC4899] to-[#BE185D]",
    border: "border-pink-300",
    text: "text-pink-100",
    accent: "text-amber-200",
    gold: "text-amber-100",
    shadow: "shadow-pink-900/40",
    name: "Blush Rose",
  },
  lavender: {
    bg: "from-[#A78BFA] via-[#8B5CF6] to-[#6D28D9]",
    border: "border-purple-300",
    text: "text-purple-100",
    accent: "text-amber-200",
    gold: "text-amber-100",
    shadow: "shadow-purple-900/40",
    name: "Lavender Silk",
  },
  sage: {
    bg: "from-[#6EE7B7] via-[#10B981] to-[#047857]",
    border: "border-emerald-300",
    text: "text-emerald-100",
    accent: "text-amber-200",
    gold: "text-amber-100",
    shadow: "shadow-emerald-900/40",
    name: "Sage Botanical",
  },
  navy: {
    bg: "from-[#38BDF8] via-[#0284C7] to-[#0F172A]",
    border: "border-sky-300",
    text: "text-sky-100",
    accent: "text-amber-200",
    gold: "text-amber-100",
    shadow: "shadow-slate-900/60",
    name: "Midnight Stars",
  },
  cream: {
    bg: "from-[#FEF3C7] via-[#FDE68A] to-[#D97706]",
    border: "border-amber-300",
    text: "text-amber-950",
    accent: "text-amber-900",
    gold: "text-amber-900",
    shadow: "shadow-amber-900/30",
    name: "Vintage Linen",
  },
  espresso: {
    bg: "from-[#78350F] via-[#451A03] to-[#291102]",
    border: "border-amber-600",
    text: "text-amber-100",
    accent: "text-amber-300",
    gold: "text-amber-200",
    shadow: "shadow-amber-950/60",
    name: "Espresso Leather",
  },
};

const CHARMS = [
  { id: "star", label: "Golden Star", icon: "⭐" },
  { id: "lotus", label: "Zen Lotus", icon: "🪷" },
  { id: "moon", label: "Crescent Moon", icon: "🌙" },
  { id: "clover", label: "Lucky Clover", icon: "🍀" },
  { id: "butterfly", label: "Butterfly", icon: "🦋" },
];

export const DiaryCover: React.FC<DiaryCoverProps> = ({
  displayName,
  coverConfig,
  entriesCount,
  latestEntry,
  themeId = "classic",
  onOpenDiary,
  onUpdateCoverConfig,
  onOpenThemeSelector,
  onOpenThemesModal,
}) => {
  const openThemesPicker = onOpenThemesModal || onOpenThemeSelector;
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<CoverConfig["color"]>(
    coverConfig?.color || "lavender"
  );
  const [selectedCharm, setSelectedCharm] = useState<CoverConfig["charm"]>(
    coverConfig?.charm || "star"
  );
  const [customTitle, setCustomTitle] = useState<string>(
    coverConfig?.title || ""
  );

  const activeThemeDef = DIARY_THEMES[themeId] || DIARY_THEMES.classic;
  const isDarkEnvironment = ["galaxy", "ocean", "peacock", "windy_leaves"].includes(themeId);
  const coverTheme = COLOR_THEMES[selectedColor] || COLOR_THEMES.lavender;
  
  // Use theme cover gradient unless explicitly customized
  const coverBg = coverConfig?.color ? coverTheme.bg : activeThemeDef.cover.bg;
  const coverBorder = coverConfig?.color ? coverTheme.border : activeThemeDef.cover.border;

  const charmItem = CHARMS.find((c) => c.id === selectedCharm) || CHARMS[0];

  const defaultTitle = `${displayName ? displayName.toUpperCase() : "MONI"}'S DIARY ✨`;
  const displayCoverTitle = customTitle.trim() || coverConfig?.title || defaultTitle;

  const handleSaveCustomization = async () => {
    const updated: CoverConfig = {
      color: selectedColor,
      texture: "leather",
      title: customTitle.trim() || defaultTitle,
      subtitle: "Private thoughts, memories & little moments",
      charm: selectedCharm,
      themeId,
    };
    await onUpdateCoverConfig(updated);
    setIsCustomizeOpen(false);
  };

  return (
    <div className="h-full w-full flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 bg-transparent relative overflow-y-auto sm:overflow-hidden select-none">
      {/* Top Welcome Heading - Adaptive to Theme Canvas */}
      <div className="text-center mb-2 sm:mb-4 z-10 max-w-md shrink-0">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold border shadow-2xs mb-1.5 backdrop-blur-xs transition-colors ${
            isDarkEnvironment
              ? "bg-white/15 border-white/20 text-amber-200 shadow-md"
              : "bg-white/80 border-amber-200/70 text-amber-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Your Physical Scrapbook &amp; Diary</span>
        </span>
        <h1
          className={`text-xl sm:text-2xl font-serif font-bold tracking-tight transition-colors ${
            isDarkEnvironment ? "text-white drop-shadow-md" : "text-slate-900"
          }`}
        >
          Welcome, {displayName || "Dear Friend"}
        </h1>
        <p
          className={`text-[11px] sm:text-xs mt-0.5 font-sans transition-colors ${
            isDarkEnvironment ? "text-slate-200 drop-shadow-xs" : "text-slate-600"
          }`}
        >
          A timeless space for your unfiltered thoughts, cherished photos, and mindful reflections.
        </p>
      </div>

      {/* Physical Diary Book (3D Perspective) */}
      <div className="relative group perspective-1000 z-10 my-auto shrink min-h-0">
        {/* Shadow & Paper Stack Depth Behind the Book */}
        <div className="absolute -inset-2 bg-black/35 rounded-2xl blur-xl transform translate-y-6 scale-95" />
        
        {/* Layered Paper Edges on Right (Physical Gilded Pages) */}
        <div className="absolute top-3 -right-3 bottom-3 w-5 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-200 rounded-r-md shadow-md border-y border-r border-amber-300/60 flex flex-col justify-between py-2 px-0.5">
          <div className="h-full w-full border-r border-dashed border-amber-300/40" />
        </div>
        <div className="absolute top-2 -right-1.5 bottom-2 w-3 bg-gradient-to-r from-amber-200 to-amber-100 rounded-r-sm border-r border-amber-300/40" />

        {/* The Diary Cover Container */}
        <div
          id="diary-physical-cover"
          onClick={onOpenDiary}
          className={`relative w-[280px] sm:w-[320px] md:w-[340px] h-[370px] sm:h-[410px] md:h-[440px] max-h-[52vh] rounded-r-2xl rounded-l-md bg-gradient-to-br ${coverBg} p-5 sm:p-6 flex flex-col justify-between cursor-pointer border-4 ${coverBorder} shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:shadow-3xl`}
        >
          {/* Spine Binding Crease on Left */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/40 via-black/10 to-transparent rounded-l-sm pointer-events-none">
            {/* Spine gold accent stitch bars */}
            <div className="absolute top-6 left-1.5 right-2 h-1 bg-amber-200/40 rounded-full" />
            <div className="absolute top-20 left-1.5 right-2 h-0.5 bg-amber-200/30 rounded-full" />
            <div className="absolute bottom-20 left-1.5 right-2 h-0.5 bg-amber-200/30 rounded-full" />
            <div className="absolute bottom-6 left-1.5 right-2 h-1 bg-amber-200/40 rounded-full" />
          </div>

          {/* Golden Bookmark Ribbon & Hanging Charm */}
          <div className="absolute -top-3 right-10 flex flex-col items-center pointer-events-none z-20">
            <div className="w-5 h-20 bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 shadow-md flex items-end justify-center pb-1">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-amber-500 -mb-2" />
            </div>
            {/* Attached Golden Charm */}
            <div className="mt-2 text-2xl filter drop-shadow-md animate-bounce duration-1000">
              {charmItem.icon}
            </div>
          </div>

          {/* Top Decorative Border Corner */}
          <div className="border border-amber-200/30 rounded-xl p-3 flex flex-col items-center text-center mt-1">
            <div className="w-7 h-7 rounded-full border border-amber-200/40 flex items-center justify-center text-amber-200 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <p className="text-[9px] tracking-[0.25em] font-sans font-semibold uppercase text-amber-200/80">
              Personal Archive
            </p>
          </div>

          {/* Central Golden Title Block */}
          <div className="my-auto text-center px-2">
            <h2 className="text-lg sm:text-xl font-serif font-black tracking-wide text-amber-100 drop-shadow-md uppercase leading-snug">
              {displayCoverTitle}
            </h2>
            <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent mx-auto my-2" />
            <p className="text-[11px] font-serif italic text-amber-200/80 max-w-[200px] mx-auto">
              Private thoughts, memories &amp; little moments
            </p>
          </div>

          {/* Bottom Cover Metadata & Open Hint */}
          <div className="pt-3 border-t border-amber-200/30 flex items-center justify-between text-xs text-amber-200/90 font-sans">
            <div className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-300" />
              <span>{entriesCount} {entriesCount === 1 ? "page" : "pages"}</span>
            </div>

            <span className="font-serif italic text-[11px] underline underline-offset-4 decoration-amber-300/50 group-hover:text-white transition">
              Click to Open &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls below the cover */}
      <div className="mt-4 sm:mt-5 flex items-center gap-2.5 sm:gap-3 z-10 shrink-0">
        <button
          type="button"
          id="btn-open-diary"
          onClick={onOpenDiary}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Open Diary</span>
        </button>

        {openThemesPicker && (
          <button
            type="button"
            id="btn-open-themes"
            onClick={openThemesPicker}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5 hover:shadow-md ${
              isDarkEnvironment
                ? "bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md"
                : "bg-white/95 hover:bg-white text-slate-800 border border-amber-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Themes ({activeThemeDef.name})</span>
          </button>
        )}

        <button
          type="button"
          id="btn-customize-cover"
          onClick={() => setIsCustomizeOpen(true)}
          className={`px-4 py-2.5 rounded-xl text-xs font-medium shadow-sm transition flex items-center gap-1.5 ${
            isDarkEnvironment
              ? "bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/20 backdrop-blur-md"
              : "bg-white/90 hover:bg-white text-slate-700 border border-amber-200"
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-purple-500" />
          <span>Customize</span>
        </button>
      </div>

      {/* Cover Customization Modal */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-amber-200 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-serif font-bold text-slate-800">Customize Your Diary Cover</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizeOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Custom Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Cover Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={defaultTitle}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Color Palette */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Cover Color &amp; Material</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(COLOR_THEMES) as Array<CoverConfig["color"]>).map((col) => {
                  const item = COLOR_THEMES[col];
                  const isSel = selectedColor === col;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`p-2 rounded-xl text-left border transition flex items-center gap-2 ${
                        isSel
                          ? "border-purple-600 bg-purple-50 ring-2 ring-purple-300"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.bg}`} />
                      <span className="text-[11px] font-medium text-slate-700 truncate">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Charm Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Hanging Charm</label>
              <div className="flex items-center gap-2">
                {CHARMS.map((c) => {
                  const isSel = selectedCharm === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCharm(c.id as any)}
                      className={`flex-1 p-2 rounded-xl text-center border text-lg transition ${
                        isSel
                          ? "border-amber-500 bg-amber-50 ring-2 ring-amber-300"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                      title={c.label}
                    >
                      {c.icon}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
              <button
                type="button"
                onClick={() => setIsCustomizeOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomization}
                className="px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition"
              >
                Save Cover Style
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
