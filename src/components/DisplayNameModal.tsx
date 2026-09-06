import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Sparkles, X, Check, Smile } from "lucide-react";
import { GeminiIcon } from "./GeminiIcon";

interface DisplayNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInitialPrompt?: boolean;
}

const POPULAR_EMOJIS = ["✨", "🌸", "🌿", "☀️", "🚀", "💡", "🌷", "🌊", "🕊️", "💜", "🍵", "🌈"];

export const DisplayNameModal: React.FC<DisplayNameModalProps> = ({
  isOpen,
  onClose,
  isInitialPrompt = false,
}) => {
  const { displayName, updateDisplayName } = useAuth();
  const [nameInput, setNameInput] = useState<string>(displayName || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNameInput(displayName && displayName !== "Friend" ? displayName : "");
      setValidationError(null);
    }
  }, [isOpen, displayName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim();
    if (!clean) {
      setValidationError("Please enter a display name or nickname.");
      return;
    }
    if (clean.length > 50) {
      setValidationError("Name must be 50 characters or fewer.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDisplayName(clean);
      onClose();
    } catch (err: any) {
      setValidationError("Could not save name. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppendEmoji = (emoji: string) => {
    setNameInput((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-purple-100 relative">
        {/* Close button if not initial required prompt */}
        {!isInitialPrompt && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header with Gemini sparkle badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 border border-purple-100 flex items-center justify-center shadow-xs">
            <GeminiIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-slate-900 tracking-tight">
              {isInitialPrompt ? "Welcome to Your Journal ✨" : "Edit Display Name"}
            </h3>
            <p className="text-xs text-slate-500">
              {isInitialPrompt
                ? "Hey! What should we call you?"
                : "Change how your name appears across your journal"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="display-name-input"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Your Preferred Name / Nickname
            </label>
            <div className="relative">
              <input
                id="display-name-input"
                type="text"
                autoFocus
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setValidationError(null);
                }}
                placeholder="e.g. Moni ✨, Monika 🌸, Moni 🚀"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200/50 transition-all placeholder:text-slate-400"
              />
            </div>
            {validationError && (
              <p className="text-xs text-rose-500 mt-1.5 font-medium">{validationError}</p>
            )}
          </div>

          {/* Quick emoji helper chips */}
          <div>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-2">
              <Smile className="w-3.5 h-3.5 text-purple-500" />
              <span>Tap to add cheerful emojis:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleAppendEmoji(emoji)}
                  className="w-8 h-8 rounded-xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-100/60 text-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            {!isInitialPrompt && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              id="save-display-name-button"
              disabled={isSubmitting || !nameInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-95 disabled:opacity-50 text-white text-xs font-medium shadow-md shadow-purple-500/20 transition-all hover:shadow-lg"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isInitialPrompt ? "Start Journaling ✨" : "Save Name"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
