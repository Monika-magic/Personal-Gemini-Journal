import React, { useState } from "react";
import { X, Check, Volume2, Sparkles, Wind, Eye } from "lucide-react";
import { DiaryThemeId } from "../types";
import { DIARY_THEMES } from "../data/themes";

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeId?: DiaryThemeId;
  currentThemeId?: DiaryThemeId;
  onSelectTheme: (themeId: DiaryThemeId) => void;
  ambientSoundEnabled?: boolean;
  onToggleAmbientSound?: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  activeThemeId,
  currentThemeId,
  onSelectTheme,
  ambientSoundEnabled = false,
  onToggleAmbientSound,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const initialThemeId = activeThemeId || currentThemeId || "classic";
  const [selectedThemeId, setSelectedThemeId] = useState<DiaryThemeId>(initialThemeId);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  // Sync selected when modal opens
  React.useEffect(() => {
    setSelectedThemeId(initialThemeId);
  }, [initialThemeId, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    setIsApplying(true);
    onSelectTheme(selectedThemeId);
    setTimeout(() => {
      setIsApplying(false);
      onClose();
    }, 250);
  };

  const themeList = Object.values(DIARY_THEMES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-amber-200/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-white to-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-800 tracking-tight">
                Immersive Diary Themes
              </h2>
              <p className="text-xs text-slate-500">
                Transform your writing environment, lighting, cover, and living atmosphere
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - List of Themes */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {themeList.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              const isCurrentlyActive = currentThemeId === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`relative p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-rose-500 bg-rose-50/30 shadow-md ring-2 ring-rose-200"
                      : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Active / Current indicator badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {/* Miniature Book Preview Chip */}
                      <div
                        className={`w-9 h-11 rounded-sm bg-gradient-to-br ${theme.cover.bg} border ${theme.cover.border} shadow-sm flex items-center justify-center text-sm`}
                      >
                        <span>{theme.cover.charmDefault}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif font-bold text-sm text-slate-900">
                            {theme.name}
                          </h3>
                          {isCurrentlyActive && (
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{theme.tagline}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {theme.description}
                  </p>

                  {/* Feature Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {theme.cover.label}
                    </span>
                    {theme.sound.hasAmbientSound && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-medium">
                        <Volume2 className="w-3 h-3" />
                        <span>{theme.sound.label}</span>
                      </span>
                    )}
                    {theme.id === "windy_leaves" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium">
                        <Wind className="w-3 h-3" />
                        <span>Dynamic Leaves</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ambient Sound Option */}
          {onToggleAmbientSound && (
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-600" />
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    Ambient Nature Audio
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Plays calming procedural ocean surf or forest breeze for supported themes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleAmbientSound}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  ambientSoundEnabled ? "bg-sky-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    ambientSoundEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Accessibility Option: Reduced Motion */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-semibold text-slate-800">
                  Reduced Environmental Motion
                </span>
                <p className="text-[11px] text-slate-500">
                  Softens continuous wave animations, falling leaves, and star twinkling
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleReducedMotion}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                reducedMotion ? "bg-rose-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  reducedMotion ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 italic">
            Saved to your private account preferences
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplying}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-1.5"
            >
              {isApplying ? (
                <span>Applying...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Theme</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
