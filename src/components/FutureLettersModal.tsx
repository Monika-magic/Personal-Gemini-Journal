import React, { useState } from "react";
import { X, Mail, Lock, Unlock, Plus, Calendar, Sparkles, Heart } from "lucide-react";
import { FutureLetter } from "../types";

interface FutureLettersModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: FutureLetter[];
  onAddLetter: (title: string, content: string, unlockDate: string) => Promise<void>;
  onUnsealLetter: (id: string) => Promise<void>;
}

export const FutureLettersModal: React.FC<FutureLettersModalProps> = ({
  isOpen,
  onClose,
  letters,
  onAddLetter,
  onUnsealLetter,
}) => {
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [unlockDate, setUnlockDate] = useState<string>("");
  const [activeLetter, setActiveLetter] = useState<FutureLetter | null>(null);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  const handleComposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !unlockDate) return;

    await onAddLetter(title.trim(), content.trim(), unlockDate);
    setTitle("");
    setContent("");
    setUnlockDate("");
    setIsComposing(false);
  };

  const handleQuickPreset = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    setUnlockDate(d.toISOString().split("T")[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border border-amber-200 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header - Secret Pocket Theme */}
        <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-100/60 via-amber-50 to-rose-50/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">💌</span>
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-800">Diary&apos;s Secret Pocket</h3>
              <p className="text-[11px] text-slate-500">Sealed letters written to your future self</p>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeLetter ? (
            /* Reading an Unsealed Letter */
            <div className="space-y-4 animate-in fade-in">
              <button
                type="button"
                onClick={() => setActiveLetter(null)}
                className="text-xs text-amber-800 hover:text-amber-950 font-serif flex items-center gap-1"
              >
                &larr; Back to Secret Pocket
              </button>

              <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-amber-200 shadow-inner space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-amber-800 font-mono">
                      Penned on {new Date(activeLetter.createdAt).toLocaleDateString()}
                    </span>
                    <h4 className="text-base font-serif font-bold text-slate-800">
                      {activeLetter.title}
                    </h4>
                  </div>
                  <span className="text-xs font-serif italic text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Wax Seal Broken ✨
                  </span>
                </div>

                <div className="text-xs font-serif text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {activeLetter.content}
                </div>
              </div>
            </div>
          ) : isComposing ? (
            /* Composing a Letter */
            <form onSubmit={handleComposeSubmit} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 font-serif">Pen a Letter to Your Future Self</h4>
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700">Letter Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. To Me in 6 Months: Don't forget what you survived"
                  className="w-full text-xs bg-white border border-amber-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-300 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700">Letter Content</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear future me, right now I am feeling..."
                  className="w-full text-xs font-serif bg-white border border-amber-200 rounded-xl p-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-300 resize-none leading-relaxed mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Sealed Until (Unlock Date)
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(1)}
                    className="px-2.5 py-1 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition"
                  >
                    +1 Month
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(3)}
                    className="px-2.5 py-1 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition"
                  >
                    +3 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(6)}
                    className="px-2.5 py-1 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition"
                  >
                    +6 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(12)}
                    className="px-2.5 py-1 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition"
                  >
                    +1 Year
                  </button>
                </div>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="text-xs bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-amber-100">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Seal with Wax &amp; Save</span>
                </button>
              </div>
            </form>
          ) : (
            /* Letters List */
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setIsComposing(true)}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-amber-900 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Slip a New Letter into Secret Pocket</span>
              </button>

              {letters.length === 0 ? (
                <div className="text-center py-10 bg-amber-50/30 rounded-2xl border border-dashed border-amber-200 p-6 space-y-2">
                  <Mail className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-700 font-serif">
                    Your secret pocket is currently empty.
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Write words of courage, hope, or predictions to your future self. They will remain securely sealed until your chosen date arrives.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {letters.map((letter) => {
                    const isUnlockable = todayStr >= letter.unlockDate;
                    const isUnsealed = !letter.sealed;

                    return (
                      <div
                        key={letter.id}
                        className={`p-4 rounded-2xl border transition flex flex-col justify-between relative overflow-hidden ${
                          isUnsealed
                            ? "bg-white border-amber-200 shadow-2xs hover:border-amber-400"
                            : isUnlockable
                            ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-300/60 shadow-sm"
                            : "bg-[#FAF7F0] border-amber-200/70"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-mono">
                              Sealed: {new Date(letter.createdAt).toLocaleDateString()}
                            </span>
                            {isUnsealed ? (
                              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-amber-600" />
                            )}
                          </div>

                          <h5 className="text-xs font-bold font-serif text-slate-800 line-clamp-1">
                            {letter.title}
                          </h5>

                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-500" />
                            <span>Unlocks: {letter.unlockDate}</span>
                          </p>
                        </div>

                        <div className="mt-4 pt-2 border-t border-amber-100 flex items-center justify-between">
                          {isUnsealed ? (
                            <button
                              type="button"
                              onClick={() => setActiveLetter(letter)}
                              className="text-xs font-semibold text-amber-800 hover:text-amber-950 font-serif underline"
                            >
                              Read Letter &rarr;
                            </button>
                          ) : isUnlockable ? (
                            <button
                              type="button"
                              onClick={async () => {
                                await onUnsealLetter(letter.id);
                                setActiveLetter({ ...letter, sealed: false });
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition"
                            >
                              Break Wax Seal ✨
                            </button>
                          ) : (
                            <span className="text-[10px] font-serif italic text-amber-700">
                              🔒 Sealed by Wax
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
