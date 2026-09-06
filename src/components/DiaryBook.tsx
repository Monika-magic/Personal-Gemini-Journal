import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Sparkles,
  Plus,
  Calendar,
  Lock,
  Compass,
  ArrowLeft,
  Volume2,
  VolumeX,
} from "lucide-react";
import { JournalEntry, DiaryThemeId } from "../types";
import { DIARY_THEMES } from "../data/themes";
import { DiaryPageCanvas } from "./DiaryPageCanvas";

interface DiaryBookProps {
  entries: JournalEntry[];
  currentEntry: JournalEntry;
  themeId?: DiaryThemeId;
  onSelectEntry: (entry: JournalEntry) => void;
  onUpdateEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => void;
  onCloseToCover: () => void;
  onOpenStickerDrawer: () => void;
  onOpenVoiceModal: () => void;
  onOpenGemini: () => void;
  onOpenIndexModal: () => void;
  onOpenMemoriesModal: () => void;
  onOpenLettersModal: () => void;
  onOpenIntentionsDrawer: () => void;
  onOpenThemeSelector?: () => void;
  ambientSoundPlaying?: boolean;
  onToggleAmbientSound?: () => void;
  isSaving?: boolean;
}

export const DiaryBook: React.FC<DiaryBookProps> = ({
  entries,
  currentEntry,
  themeId = "classic",
  onSelectEntry,
  onUpdateEntry,
  onNewEntry,
  onDeleteEntry,
  onCloseToCover,
  onOpenStickerDrawer,
  onOpenVoiceModal,
  onOpenGemini,
  onOpenIndexModal,
  onOpenMemoriesModal,
  onOpenLettersModal,
  onOpenIntentionsDrawer,
  onOpenThemeSelector,
  ambientSoundPlaying = false,
  onToggleAmbientSound,
  isSaving,
}) => {
  const activeThemeDef = DIARY_THEMES[themeId] || DIARY_THEMES.classic;
  const currentIndex = entries.findIndex((e) => e.id === currentEntry.id);
  const prevEntry = currentIndex > 0 ? entries[currentIndex - 1] : null;
  const nextEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null;

  const [pageFlipDirection, setPageFlipDirection] = useState<"next" | "prev" | null>(null);

  const handlePrevPage = () => {
    if (prevEntry) {
      setPageFlipDirection("prev");
      setTimeout(() => {
        onSelectEntry(prevEntry);
        setPageFlipDirection(null);
      }, 150);
    }
  };

  const handleNextPage = () => {
    if (nextEntry) {
      setPageFlipDirection("next");
      setTimeout(() => {
        onSelectEntry(nextEntry);
        setPageFlipDirection(null);
      }, 150);
    } else {
      // If at end, creating a fresh page
      onNewEntry();
    }
  };

  return (
    <div className="h-full w-full flex-1 min-h-0 flex flex-col items-center justify-start p-2 sm:p-3 md:p-4 bg-transparent select-none overflow-hidden">
      {/* Diary Control Ribbon Bar */}
      <div className="w-full max-w-6xl mb-2 sm:mb-2.5 flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 bg-white/95 border border-amber-300/80 rounded-xl shadow-md backdrop-blur-md shrink-0 text-xs">
        {/* Left Book Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={onCloseToCover}
            className="px-2.5 py-1 text-xs font-serif font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition flex items-center gap-1 shadow-2xs shrink-0"
            title="Fold and Close Diary"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden xs:inline">Close</span> Cover
          </button>

          <button
            type="button"
            onClick={onOpenIndexModal}
            className="px-2.5 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100 rounded-lg transition flex items-center gap-1 shrink-0"
          >
            <Book className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Index</span>
          </button>

          <button
            type="button"
            onClick={onOpenMemoriesModal}
            className="px-2.5 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100 rounded-lg transition flex items-center gap-1 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Time Capsule</span>
          </button>

          <button
            type="button"
            onClick={onOpenLettersModal}
            className="px-2.5 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100 rounded-lg transition flex items-center gap-1 shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Pocket</span>
          </button>

          <button
            type="button"
            onClick={onOpenIntentionsDrawer}
            className="px-2.5 py-1 text-xs font-medium text-emerald-900 hover:bg-emerald-100 rounded-lg transition flex items-center gap-1 shrink-0"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Intentions</span>
          </button>

          {/* Theme Selector Ribbon Button */}
          {onOpenThemeSelector && (
            <button
              type="button"
              onClick={onOpenThemeSelector}
              className="px-2.5 py-1 text-xs font-semibold text-purple-950 bg-purple-100/90 hover:bg-purple-200 border border-purple-300 rounded-lg transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span className="capitalize hidden sm:inline">{activeThemeDef.name}</span>
              <span className="sm:hidden">Theme</span>
            </button>
          )}

          {/* Ambient Sound Toggle if applicable */}
          {activeThemeDef.sound.hasAmbientSound && onToggleAmbientSound && (
            <button
              type="button"
              onClick={onToggleAmbientSound}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1.5 shrink-0 border ${
                ambientSoundPlaying
                  ? "bg-sky-100 text-sky-950 border-sky-300 font-semibold"
                  : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
              }`}
              title={ambientSoundPlaying ? "Turn Off Ambient Sound" : "Turn On Ambient Sound"}
            >
              {ambientSoundPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-700 animate-pulse" />
                  <span className="hidden xs:inline">Sound ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden xs:inline">Sound OFF</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Right Page Navigation & Fresh Page */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Page Counter */}
          <span className="text-xs font-serif italic text-amber-950 px-1 font-semibold">
            p. {currentIndex + 1}/{Math.max(1, entries.length)}
          </span>

          <button
            type="button"
            disabled={!prevEntry}
            onClick={handlePrevPage}
            className="p-1 text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNextPage}
            className="p-1 text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition"
            title={nextEntry ? "Next Page (Right Arrow)" : "Turn to Fresh Page"}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNewEntry}
            className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Fresh Page</span>
          </button>
        </div>
      </div>

      {/* The Physical Open Book Spread Container - Fills Available Height */}
      <div 
        style={{ backgroundColor: activeThemeDef.paper.baseBg }}
        className={`relative w-full max-w-6xl flex-1 min-h-0 rounded-2xl shadow-2xl border-4 ${activeThemeDef.cover.border} overflow-hidden flex flex-col md:flex-row transition-all duration-500`}
      >
        {/* Spine Crease / Binding Shadow in Center (Visible on md+ screens) */}
        <div className={`hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r ${activeThemeDef.paper.spineShadow} z-30 pointer-events-none`}>
          {/* Spine golden stitch dots */}
          <div className="h-full flex flex-col justify-between py-6 items-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-200/50 shadow-xs" />
            ))}
          </div>
        </div>

        {/* Top Bookmark Ribbon hanging across the book */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 flex-col items-center pointer-events-none z-40">
          <div className={`w-4 h-14 bg-gradient-to-b ${activeThemeDef.cover.ribbonGradient} shadow-md flex items-end justify-center pb-1`}>
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-rose-600 -mb-1.5" />
          </div>
        </div>

        {/* LEFT PAGE (Context / Memories / Previous Page Snippet on md+ screens) */}
        <div
          style={{ backgroundColor: activeThemeDef.paper.baseBg }}
          className="hidden md:flex flex-col w-1/2 border-r border-amber-200/80 p-5 sm:p-6 lg:p-7 relative overflow-y-auto h-full min-h-0 transition-colors duration-500"
        >
          {prevEntry ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                <span className="text-[10px] font-mono tracking-widest text-amber-950 font-semibold uppercase">
                  Previous Page • {new Date(prevEntry.createdAt).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectEntry(prevEntry)}
                  className="text-xs font-serif italic text-rose-700 hover:text-rose-900 underline font-semibold"
                >
                  Turn Back to this Page
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                {prevEntry.title}
              </h3>

              {prevEntry.content && (
                <p className="text-xs font-serif text-slate-700 line-clamp-12 leading-relaxed italic whitespace-pre-wrap">
                  {prevEntry.content}
                </p>
              )}

              {prevEntry.pageObjects && prevEntry.pageObjects.length > 0 && (
                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-950 font-serif">
                  ✨ Contains {prevEntry.pageObjects.length} preserved scrapbook items.
                </div>
              )}
            </div>
          ) : (
            /* Blank Opening Page or Welcoming Proverb */
            <div className="h-full flex flex-col justify-center items-center text-center p-4 sm:p-6 space-y-3 my-auto">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-lg shadow-2xs">
                📖
              </div>
              <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900">
                The Beginning of Your Journal
              </h4>
              <p className="text-xs font-serif italic text-slate-600 max-w-xs leading-relaxed">
                &ldquo;Fill your paper with the breathings of your heart.&rdquo;
                <br />
                <span className="font-sans text-[11px] not-italic text-slate-500 mt-1 block">
                  — William Wordsworth
                </span>
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenIndexModal}
                  className="px-3 py-1 text-xs font-serif text-amber-950 font-medium hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition"
                >
                  Browse Table of Contents
                </button>
              </div>
            </div>
          )}

          {/* Left Page Number at bottom */}
          <div className="mt-auto pt-2 text-center text-[10px] font-serif font-medium text-slate-500 shrink-0">
            p. {Math.max(1, currentIndex * 2)}
          </div>
        </div>

        {/* RIGHT PAGE (The Active Diary Canvas) */}
        <div 
          style={{ backgroundColor: activeThemeDef.paper.baseBg }}
          className="flex flex-col w-full md:w-1/2 relative h-full min-h-0 overflow-hidden transition-colors duration-500"
        >
          <DiaryPageCanvas
            entry={currentEntry}
            themeId={themeId}
            onUpdateEntry={onUpdateEntry}
            onOpenStickerDrawer={onOpenStickerDrawer}
            onOpenVoiceModal={onOpenVoiceModal}
            onOpenGemini={onOpenGemini}
            onDeleteEntry={() => onDeleteEntry(currentEntry.id)}
            isSaving={isSaving}
          />

          {/* Right Page Number at bottom */}
          <div 
            style={{ backgroundColor: activeThemeDef.paper.baseBg }}
            className="py-1 px-2 text-center text-[10px] font-serif font-medium text-slate-500 border-t border-black/5 shrink-0"
          >
            p. {currentIndex * 2 + 1}
          </div>
        </div>
      </div>
    </div>
  );
};
