import React, { useState } from "react";
import { X, Search, BookOpen, Plus, Tag, Calendar, Heart } from "lucide-react";
import { JournalEntry } from "../types";

interface DiaryIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  currentEntryId?: string;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
}

export const DiaryIndexModal: React.FC<DiaryIndexModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentEntryId,
  onSelectEntry,
  onNewEntry,
}) => {
  const [search, setSearch] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  if (!isOpen) return null;

  const allMoods = Array.from(new Set(entries.map((e) => e.mood).filter(Boolean)));

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      search === "" ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.content && e.content.toLowerCase().includes(search.toLowerCase())) ||
      (e.tags && e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesMood = selectedMood === null || e.mood === selectedMood;

    return matchesSearch && matchesMood;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border border-amber-200/90 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-rose-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-800">Table of Contents &amp; Index</h3>
              <p className="text-[11px] text-slate-500">{entries.length} pages recorded in this diary</p>
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

        {/* Search & Filters */}
        <div className="p-4 border-b border-amber-100/70 bg-amber-50/20 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all pages, tags, and memories..."
              className="w-full text-xs bg-white border border-amber-200/80 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {allMoods.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              <button
                type="button"
                onClick={() => setSelectedMood(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  selectedMood === null
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Moods
              </button>
              {allMoods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMood(selectedMood === m ? null : m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    selectedMood === m
                      ? "bg-rose-500 text-white shadow-2xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-700"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Index List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-serif">
              No diary pages matched your query.
            </div>
          ) : (
            filteredEntries.map((e, index) => {
              const isCurrent = e.id === currentEntryId;
              const pageNum = entries.findIndex((item) => item.id === e.id) + 1;

              return (
                <div
                  key={e.id}
                  onClick={() => {
                    onSelectEntry(e);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                    isCurrent
                      ? "bg-amber-100/60 border-amber-300 ring-2 ring-amber-300/60"
                      : "bg-white border-amber-100/80 hover:border-amber-300 hover:bg-amber-50/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-center text-xs font-serif font-bold text-amber-900/60 group-hover:text-amber-900">
                      {pageNum}
                    </span>

                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs font-serif font-bold text-slate-800 truncate group-hover:text-rose-700">
                        {e.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                        {e.mood && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/50">
                            {e.mood}
                          </span>
                        )}
                        {e.pageObjects && e.pageObjects.length > 0 && (
                          <span>• {e.pageObjects.length} scrapbook items</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-serif italic text-slate-400 group-hover:text-amber-800 shrink-0">
                    Turn to Page &rarr;
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-amber-100 bg-amber-50/40 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onNewEntry();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Turn to a Fresh Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
