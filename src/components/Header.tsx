import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, LogOut, Edit3, ShieldCheck, ChevronDown, User, Sparkles, Volume2, VolumeX, Palette } from "lucide-react";
import { GeminiIcon } from "./GeminiIcon";
import { DiaryThemeId } from "../types";
import { DIARY_THEMES } from "../data/themes";

interface HeaderProps {
  onNewEntry: () => void;
  onOpenEditName: () => void;
  themeId?: DiaryThemeId;
  onOpenThemesModal?: () => void;
  ambientSoundPlaying?: boolean;
  onToggleAmbientSound?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewEntry,
  onOpenEditName,
  themeId = "classic",
  onOpenThemesModal,
  ambientSoundPlaying = false,
  onToggleAmbientSound,
}) => {
  const { user, displayName, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeTheme = DIARY_THEMES[themeId] || DIARY_THEMES.classic;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100/80 shadow-xs shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 border border-purple-100/80 flex items-center justify-center shadow-xs">
            <GeminiIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-serif font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Personal Gemini Journal</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Private & Isolated</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Warm reflective journaling with your Gemini companion
            </p>
          </div>
        </div>

        {/* Actions: Themes + Ambient Sound + New Entry + Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Themes Button */}
          {onOpenThemesModal && (
            <button
              type="button"
              id="header-themes-button"
              onClick={onOpenThemesModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100/90 text-purple-900 border border-purple-200/80 text-xs font-semibold shadow-2xs transition-all active:scale-98"
              title="Change Diary Theme & Atmosphere"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Theme</span>
            </button>
          )}

          {/* Ambient Sound Toggle if theme has sound */}
          {activeTheme.sound.hasAmbientSound && onToggleAmbientSound && (
            <button
              type="button"
              id="header-ambient-sound-button"
              onClick={onToggleAmbientSound}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                ambientSoundPlaying
                  ? "bg-sky-50 text-sky-900 border-sky-300 font-semibold shadow-2xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
              title={ambientSoundPlaying ? "Turn Off Ambient Sound" : "Turn On Ambient Sound"}
            >
              {ambientSoundPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                  <span>Sound ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sound OFF</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            id="header-new-entry-button"
            onClick={onNewEntry}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-95 text-white text-xs font-medium shadow-sm shadow-purple-500/15 transition-all hover:shadow-md active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Reflection</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Profile Area */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              id="profile-dropdown-trigger"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:pr-2.5 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-100 transition-all text-left"
              aria-expanded={profileDropdownOpen}
              aria-label="User profile menu"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-200 to-pink-200 text-purple-900 flex items-center justify-center text-xs font-bold shadow-xs">
                {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden sm:block text-left max-w-[130px]">
                <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500 truncate leading-tight">
                  {user?.email || "Signed In"}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-purple-100/80 p-3.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-100 to-pink-100 text-purple-800 flex items-center justify-center text-sm font-bold">
                      {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Firestore isolation active</span>
                  </div>
                </div>

                <div className="pt-2 space-y-1">
                  {onOpenThemesModal && (
                    <button
                      type="button"
                      id="profile-themes-button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenThemesModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50/80 rounded-xl transition-colors"
                    >
                      <Palette className="w-3.5 h-3.5 text-purple-600" />
                      <span>Theme & Atmosphere ({activeTheme.name})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    id="profile-edit-name-button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenEditName();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50/80 rounded-xl transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Edit Display Name ✨</span>
                  </button>

                  <button
                    type="button"
                    id="profile-logout-button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
