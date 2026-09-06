import React, { useState } from "react";
import { JournalEntry } from "../types";
import { Search, Calendar, Tag, Trash2, BookOpen, MessageSquare, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";

interface SidebarHistoryProps {
  entries: JournalEntry[];
  activeEntryId: string | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => Promise<void>;
  userId: string;
}

export const SidebarHistory: React.FC<SidebarHistoryProps> = ({
  entries,
  activeEntryId,
  onSelectEntry,
  onDeleteEntry,
  userId,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMood = !selectedMood || e.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const moods = Array.from(new Set(entries.map((e) => e.mood).filter(Boolean)));

  const handleDelete = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this reflection? This cannot be undone.")) {
      onDeleteEntry(entryId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FCFBF9] border-r border-purple-100/70">
      {/* Search and Filters */}
      <div className="p-3.5 border-b border-purple-100/60 bg-white/70 space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            id="search-journal-entries-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reflections & tags..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50/90 border border-slate-200/80 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Mood filter pills */}
        {moods.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedMood(null)}
              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all whitespace-nowrap ${
                selectedMood === null
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Moods
            </button>
            {moods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMood(selectedMood === m ? null : m)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all whitespace-nowrap ${
                  selectedMood === m
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {filteredEntries.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            <div className="w-10 h-10 mx-auto mb-2.5 rounded-2xl bg-purple-50 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="font-medium text-slate-700">No reflections found</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {entries.length === 0
                ? "Your journal is ready for your thoughts 📖🌷"
                : "Try adjusting your search or mood filter."}
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isActive = entry.id === activeEntryId;
            const messageCount = entry.messages?.length || 0;

            return (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className={`group relative p-3.5 rounded-2xl cursor-pointer border transition-all ${
                  isActive
                    ? "bg-white border-purple-300 shadow-md shadow-purple-500/5 ring-1 ring-purple-200"
                    : "bg-white/80 border-slate-200/70 hover:bg-white hover:border-purple-200 hover:shadow-xs text-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-semibold text-slate-900 truncate flex-1">
                    {entry.title || "Untitled Reflection"}
                  </h4>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, entry.id)}
                    title="Delete entry"
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 rounded transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {entry.content || (messageCount > 0 ? `💬 ${messageCount} Gemini messages` : "Empty entry...")}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>
                      {new Date(entry.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {entry.mood && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-50/90 text-purple-700 border border-purple-100 font-medium">
                        {entry.mood}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {messageCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-purple-600 font-medium bg-purple-50 px-1.5 py-0.5 rounded-md text-[10px]">
                        <MessageSquare className="w-2.5 h-2.5" />
                        <span>{messageCount}</span>
                      </span>
                    )}
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-purple-500 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Security footer banner */}
      <div className="p-3 border-t border-purple-100/60 bg-white/60 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="truncate">
          Isolated path: <span className="font-mono text-slate-600">users/{userId.slice(0, 6)}...</span>
        </span>
      </div>
    </div>
  );
};
