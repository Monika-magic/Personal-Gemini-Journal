import React from "react";
import { X, Calendar, Sparkles, Shuffle, BookOpen, Clock, Heart } from "lucide-react";
import { JournalEntry } from "../types";

interface MemoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}

export const MemoriesModal: React.FC<MemoriesModalProps> = ({
  isOpen,
  onClose,
  entries,
  onSelectEntry,
}) => {
  if (!isOpen) return null;

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();

  // Find entries from the same day of month in prior months/years
  const onThisDayEntries = entries.filter((e) => {
    const d = new Date(e.createdAt);
    return (
      d.getDate() === currentDay &&
      (d.getMonth() !== currentMonth || d.getFullYear() !== today.getFullYear())
    );
  });

  const handleSurpriseMe = () => {
    if (entries.length === 0) return;
    const randomIndex = Math.floor(Math.random() * entries.length);
    onSelectEntry(entries[randomIndex]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border border-amber-200/90 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏳</span>
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-800">Time Capsule &amp; Memories</h3>
              <p className="text-[11px] text-slate-500">Revisit who you were on this day, or let fate choose</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Surprise Me Feature Button */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-100/60 via-pink-100/50 to-amber-100/60 border border-purple-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Shuffle className="w-3.5 h-3.5 text-purple-600" />
                <span>Surprise Me</span>
              </h4>
              <p className="text-[11px] text-purple-800/80">
                Randomly open an unexpected page from your diary journey.
              </p>
            </div>
            <button
              type="button"
              disabled={entries.length === 0}
              onClick={handleSurpriseMe}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition disabled:opacity-40"
            >
              Open Random Page
            </button>
          </div>

          {/* On This Day Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>On This Day ({today.toLocaleDateString(undefined, { month: "short", day: "numeric" })})</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-sans">
                {onThisDayEntries.length} {onThisDayEntries.length === 1 ? "memory" : "memories"}
              </span>
            </div>

            {onThisDayEntries.length === 0 ? (
              <div className="text-center py-6 px-4 bg-amber-50/40 rounded-xl border border-dashed border-amber-200/80">
                <Clock className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-700">No past entries for this exact day yet.</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Keep writing each day! As seasons pass, your future self will look back here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {onThisDayEntries.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      onSelectEntry(e);
                      onClose();
                    }}
                    className="p-3 bg-white border border-amber-200/70 hover:border-purple-300 rounded-xl cursor-pointer transition shadow-2xs hover:shadow-xs group"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-purple-700 font-serif">
                        {e.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(e.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {e.content && (
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 font-serif">
                        {e.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
