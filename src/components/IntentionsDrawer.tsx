import React, { useState } from "react";
import { X, Plus, CheckCircle, Clock, PauseCircle, Trash2, Sparkles, Bell, Calendar } from "lucide-react";
import { Intention } from "../types";

interface IntentionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  intentions: Intention[];
  onAddIntention: (title: string, description?: string, targetDate?: string) => Promise<void>;
  onUpdateStatus: (id: string, status: Intention["status"]) => Promise<void>;
  onDeleteIntention: (id: string) => Promise<void>;
  noticedSuggestion?: {
    noticed: boolean;
    quote?: string;
    suggestion?: string;
    suggestedTitle?: string;
    suggestedDescription?: string;
  } | null;
  onDismissNoticed?: () => void;
}

export const IntentionsDrawer: React.FC<IntentionsDrawerProps> = ({
  isOpen,
  onClose,
  intentions,
  onAddIntention,
  onUpdateStatus,
  onDeleteIntention,
  noticedSuggestion,
  onDismissNoticed,
}) => {
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newTargetDate, setNewTargetDate] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await onAddIntention(newTitle.trim(), newDescription.trim() || undefined, newTargetDate || undefined);
    setNewTitle("");
    setNewDescription("");
    setNewTargetDate("");
    setIsAdding(false);
  };

  const handleAcceptNoticed = async () => {
    if (!noticedSuggestion?.suggestedTitle) return;
    await onAddIntention(
      noticedSuggestion.suggestedTitle,
      noticedSuggestion.suggestedDescription || noticedSuggestion.quote,
      undefined
    );
    if (onDismissNoticed) onDismissNoticed();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 max-w-[92vw] bg-[#FFFDF9] border-l border-emerald-200/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-emerald-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-teal-50/80">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <div>
            <h3 className="text-sm font-serif font-bold text-slate-800">My Mindful Intentions</h3>
            <p className="text-[11px] text-slate-500">Gentle goals and commitments you set for yourself</p>
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
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* "Gemini noticed..." highlight card if any */}
        {noticedSuggestion && noticedSuggestion.noticed && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 border border-purple-200 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>✨ Gemini noticed something...</span>
            </div>

            {noticedSuggestion.quote && (
              <p className="text-xs font-serif italic text-slate-700 bg-white/70 p-2.5 rounded-xl border border-purple-100">
                &ldquo;{noticedSuggestion.quote}&rdquo;
              </p>
            )}

            <p className="text-xs text-purple-950 leading-relaxed">
              {noticedSuggestion.suggestion ||
                `You mentioned wanting to work on "${noticedSuggestion.suggestedTitle}". Still something you want to work toward?`}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleAcceptNoticed}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-2xs transition"
              >
                🌱 Keep this goal
              </button>
              <button
                type="button"
                onClick={onDismissNoticed}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-white/80 transition"
              >
                Let it go
              </button>
            </div>
          </div>
        )}

        {/* Add intention button / form */}
        {isAdding ? (
          <form onSubmit={handleCreate} className="p-3.5 bg-white border border-emerald-200 rounded-2xl shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800">Add an Intention</h4>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="E.g. Read 20 minutes before sleeping"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-300"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Why this matters to you (optional)"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-300"
            />
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
              >
                Plant Intention
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 px-3 border border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Set New Intention</span>
          </button>
        )}

        {/* Intentions List */}
        <div className="space-y-2.5">
          {intentions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No active intentions yet. They will appear here when you plant one or when Gemini notices commitments in your writing.
            </div>
          ) : (
            intentions.map((intent) => {
              const isCompleted = intent.status === "completed";
              const isPaused = intent.status === "paused";

              return (
                <div
                  key={intent.id}
                  className={`p-3.5 rounded-2xl border transition ${
                    isCompleted
                      ? "bg-slate-50 border-slate-200 opacity-75"
                      : "bg-white border-emerald-100 shadow-2xs hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <h5 className={`text-xs font-bold ${isCompleted ? "line-through text-slate-500" : "text-slate-800"}`}>
                        {intent.title}
                      </h5>
                      {intent.description && (
                        <p className="text-[11px] text-slate-600">{intent.description}</p>
                      )}
                      {intent.targetDate && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>Target: {intent.targetDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(intent.id, isCompleted ? "active" : "completed")}
                        title={isCompleted ? "Mark active" : "Complete intention"}
                        className={`p-1.5 rounded-lg transition ${
                          isCompleted ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:text-emerald-600"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onUpdateStatus(intent.id, isPaused ? "active" : "paused")}
                        title={isPaused ? "Resume" : "Pause"}
                        className={`p-1.5 rounded-lg transition ${
                          isPaused ? "text-amber-600 hover:bg-amber-50" : "text-slate-400 hover:text-amber-600"
                        }`}
                      >
                        <PauseCircle className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteIntention(intent.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
