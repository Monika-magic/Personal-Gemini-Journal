import React, { useState } from "react";
import { X, Sparkles, Plus } from "lucide-react";
import { STICKERS, STICKER_CATEGORIES, StickerDefinition } from "../data/stickers";

interface StickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSticker: (stickerId: string) => void;
}

export const StickerDrawer: React.FC<StickerDrawerProps> = ({
  isOpen,
  onClose,
  onAddSticker,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<StickerDefinition["category"]>("flowers");

  if (!isOpen) return null;

  const filteredStickers = STICKERS.filter((s) => s.category === selectedCategory);

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 max-w-[90vw] bg-[#FFFDF9] border-l border-amber-200/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 to-rose-50/70">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎀</span>
          <div>
            <h3 className="text-sm font-serif font-bold text-slate-800">Sticker Scrapbook Studio</h3>
            <p className="text-[11px] text-slate-500">Pick stickers to decorate your diary page</p>
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

      {/* Category Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-amber-100 overflow-x-auto bg-amber-50/30 scrollbar-none">
        {STICKER_CATEGORIES.map((cat) => {
          const isActive = cat.id === selectedCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                isActive
                  ? "bg-rose-500 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-rose-50/80 hover:text-rose-700"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sticker Grid */}
      <div className="p-4 flex-1 overflow-y-auto grid grid-cols-2 gap-3.5 content-start">
        {filteredStickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            onClick={() => onAddSticker(sticker.id)}
            className="group relative flex flex-col items-center justify-center p-3.5 rounded-xl border border-amber-200/60 bg-white hover:border-rose-300 hover:shadow-md transition transform hover:-translate-y-0.5 active:scale-95"
          >
            <div className="w-16 h-16 flex items-center justify-center pointer-events-none transition group-hover:scale-110">
              {sticker.render()}
            </div>
            <span className="mt-2 text-[11px] font-medium text-slate-600 group-hover:text-rose-600 truncate max-w-full">
              {sticker.name}
            </span>
            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      {/* Footer tip */}
      <div className="p-3 border-t border-amber-100 bg-amber-50/50 text-center">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Click any sticker to place it onto the active page!</span>
        </p>
      </div>
    </div>
  );
};
