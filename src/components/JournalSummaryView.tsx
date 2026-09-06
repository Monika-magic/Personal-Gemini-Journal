import React, { useState } from "react";
import { JournalSummary } from "../types";
import { Sparkles, Heart, Tag, CheckCircle2, RefreshCw, Bookmark, Check, Compass, Brain } from "lucide-react";
import { GeminiIcon } from "./GeminiIcon";

interface JournalSummaryViewProps {
  summary: JournalSummary | null;
  onGenerateSummary: () => Promise<void>;
  onSaveSummary: (summary: JournalSummary) => Promise<void>;
  isGenerating: boolean;
  canGenerate: boolean;
}

export const JournalSummaryView: React.FC<JournalSummaryViewProps> = ({
  summary,
  onGenerateSummary,
  onSaveSummary,
  isGenerating,
  canGenerate,
}) => {
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const toggleItem = (idx: number) => {
    setCompletedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSave = async () => {
    if (!summary || saveLoading) return;
    setSaveLoading(true);
    try {
      await onSaveSummary(summary);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save summary:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-6">
      {/* Top Banner & Actions */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50/70 via-purple-50/70 to-pink-50/70 border border-purple-100/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center justify-center">
            <GeminiIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center gap-1.5">
              <span>Gemini AI Journal Synthesis</span>
              <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Insights Engine
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Deep reflection on your thoughts, emotions, themes, and mindful steps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {summary && (
            <button
              type="button"
              id="save-summary-button"
              onClick={handleSave}
              disabled={saveLoading}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 shadow-xs transition-all flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Saved to Firestore</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-purple-600" />
                  <span>Save Synthesis</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            id="generate-summary-button"
            onClick={onGenerateSummary}
            disabled={isGenerating || !canGenerate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-95 disabled:opacity-50 text-white text-xs font-medium shadow-sm shadow-purple-500/15 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>{isGenerating ? "Reflecting with Gemini..." : summary ? "Re-synthesize ✨" : "Synthesize Entry ✨"}</span>
          </button>
        </div>
      </div>

      {/* Main Content: Empty State or Separate Cards */}
      {!summary ? (
        <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-purple-100/70 p-8 shadow-xs space-y-4">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 border border-purple-100 flex items-center justify-center shadow-xs">
            <GeminiIcon className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <p className="text-base font-serif font-semibold text-slate-800">
              No Synthesis Generated Yet 🌷
            </p>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Write notes in your journal and click "Synthesize Entry". Gemini will extract your emotional tone, key themes, personalized insights, and mindful action prompts.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Card 1: Emotional Tone & Key Themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 💭 Emotional Tone */}
            <div className="p-5 rounded-3xl bg-white border border-purple-100/80 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs tracking-wide">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>💭 Emotional Tone</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-rose-50/80 border border-rose-100 text-rose-800 text-xs font-medium">
                <span>{summary.emotionalTone || "Reflective & Centered"}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Detected underlying mood and emotional sentiment throughout your reflection.
              </p>
            </div>

            {/* 🧠 Key Themes */}
            <div className="p-5 rounded-3xl bg-white border border-purple-100/80 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs tracking-wide">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>🧠 Key Themes</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {summary.keyThemes && summary.keyThemes.length > 0 ? (
                  summary.keyThemes.map((theme, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-100/80 text-xs font-medium"
                    >
                      <Tag className="w-3 h-3 text-purple-400" />
                      <span>{theme}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">General Reflection</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: 🔎 Reflective Insights & Synthesis */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs tracking-wide">
              <Compass className="w-4 h-4 text-amber-500" />
              <span>🔎 In-Depth Insights & Synthesis</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
              {summary.insights}
            </p>
          </div>

          {/* Card 3: 🌱 Mindful Action & Contemplation Points */}
          {summary.actionItems && summary.actionItems.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-purple-100/80 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs tracking-wide">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>🌱 Mindful Action Points & Reflection Checklist</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Tap to mark completed
                </span>
              </div>

              <ul className="space-y-2.5">
                {summary.actionItems.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => toggleItem(idx)}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 hover:bg-purple-50/50 border border-slate-200/60 hover:border-purple-200 cursor-pointer transition-all group"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                        completedItems[idx]
                          ? "text-emerald-500 fill-emerald-100"
                          : "text-slate-300 group-hover:text-purple-400"
                      }`}
                    />
                    <span
                      className={`text-xs leading-relaxed transition-colors ${
                        completedItems[idx]
                          ? "line-through text-slate-400"
                          : "text-slate-700 group-hover:text-slate-900 font-medium"
                      }`}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
