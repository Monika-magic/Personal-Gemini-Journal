import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Image as ImageIcon,
  Smile,
  Tag,
  Trash2,
  RotateCw,
  Maximize2,
  Minimize2,
  Layers,
  Wand2,
  Mic,
  Pin,
  Check,
  Palette,
  Type,
  X,
  Plus,
} from "lucide-react";
import {
  JournalEntry,
  PageObject,
  PaperStyle,
  FontStyle,
  PhotoFrameStyle,
  GeminiReflectionData,
  DiaryThemeId,
} from "../types";
import { STICKERS } from "../data/stickers";
import { DIARY_THEMES } from "../data/themes";
import { GeminiIcon } from "./GeminiIcon";

interface DiaryPageCanvasProps {
  entry: JournalEntry;
  onUpdateEntry: (entry: JournalEntry) => void;
  onOpenStickerDrawer: () => void;
  onOpenVoiceModal: () => void;
  onOpenGemini: () => void;
  onDeleteEntry: () => void;
  isSaving?: boolean;
  themeId?: DiaryThemeId;
}

const PAPER_STYLES: { id: PaperStyle; label: string; bgClass: string }[] = [
  { id: "ruled", label: "Ruled Lines", bgClass: "paper-ruled" },
  { id: "plain", label: "Ivory Parchment", bgClass: "paper-plain" },
  { id: "grid", label: "Dot Grid", bgClass: "paper-grid" },
  { id: "vintage", label: "Vintage Sepia", bgClass: "paper-vintage" },
  { id: "floral", label: "Floral Whisper", bgClass: "paper-floral" },
  { id: "scrapbook", label: "Pastel Craft", bgClass: "paper-scrapbook" },
];

const MOODS = [
  { label: "🌸 Serene", value: "Serene" },
  { label: "☀️ Joyful", value: "Joyful" },
  { label: "💭 Reflective", value: "Reflective" },
  { label: "🌧️ Melancholy", value: "Melancholy" },
  { label: "🔥 Driven", value: "Driven" },
  { label: "🌿 Grounded", value: "Grounded" },
  { label: "✨ Inspired", value: "Inspired" },
];

const PHOTO_FRAMES: { id: PhotoFrameStyle; label: string }[] = [
  { id: "polaroid", label: "Polaroid" },
  { id: "taped", label: "Washi Taped" },
  { id: "pinned", label: "Brass Pinned" },
  { id: "instant", label: "Instant Border" },
  { id: "torn", label: "Torn Edge" },
];

export const DiaryPageCanvas: React.FC<DiaryPageCanvasProps> = ({
  entry,
  onUpdateEntry,
  onOpenStickerDrawer,
  onOpenVoiceModal,
  onOpenGemini,
  onDeleteEntry,
  isSaving,
  themeId = "classic",
}) => {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<string>("");
  const [isTagInputOpen, setIsTagInputOpen] = useState<boolean>(false);
  const [isPaperSelectorOpen, setIsPaperSelectorOpen] = useState<boolean>(false);

  const activeTheme = DIARY_THEMES[themeId] || DIARY_THEMES.classic;

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const paperStyle = entry.paperStyle || "ruled";
  const fontStyle = entry.fontStyle || "handwritten";
  const pageObjects = entry.pageObjects || [];

  // Parse reflection note if stored
  let parsedReflection: GeminiReflectionData | null = null;
  if (entry.geminiReflection) {
    try {
      parsedReflection = JSON.parse(entry.geminiReflection);
    } catch {
      parsedReflection = {
        reflection: entry.geminiReflection,
        emotionalTone: "Contemplative",
        coreInsight: "A moment preserved in ink.",
        mindfulPrompt: "What did this teach you today?",
      };
    }
  }

  // Handle Text Content Change
  const handleContentChange = (content: string) => {
    onUpdateEntry({
      ...entry,
      content,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle Title Change
  const handleTitleChange = (title: string) => {
    onUpdateEntry({
      ...entry,
      title,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle Mood Change
  const handleMoodChange = (mood: string) => {
    onUpdateEntry({
      ...entry,
      mood,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle Paper Style Change
  const handlePaperStyleChange = (style: PaperStyle) => {
    onUpdateEntry({
      ...entry,
      paperStyle: style,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handle Font Style Change
  const handleFontStyleChange = (style: FontStyle) => {
    onUpdateEntry({
      ...entry,
      fontStyle: style,
      updatedAt: new Date().toISOString(),
    });
  };

  // Add Tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, "");
    if (!entry.tags.includes(cleanTag)) {
      onUpdateEntry({
        ...entry,
        tags: [...entry.tags, cleanTag],
        updatedAt: new Date().toISOString(),
      });
    }
    setTagInput("");
    setIsTagInputOpen(false);
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateEntry({
      ...entry,
      tags: entry.tags.filter((t) => t !== tagToRemove),
      updatedAt: new Date().toISOString(),
    });
  };

  // Photo Upload Handler with client-side canvas compression to keep doc size optimal
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600;
        const scaleSize = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);

          const newPhotoObj: PageObject = {
            id: "obj-" + Date.now(),
            type: "photo",
            x: 20 + Math.random() * 25,
            y: 20 + Math.random() * 25,
            width: 170,
            height: 190,
            rotation: (Math.random() - 0.5) * 12,
            zIndex: pageObjects.length + 1,
            url: compressedDataUrl,
            frameStyle: "polaroid",
            caption: "",
          };

          const updatedObjects = [...pageObjects, newPhotoObj];
          onUpdateEntry({
            ...entry,
            pageObjects: updatedObjects,
            updatedAt: new Date().toISOString(),
          });
          setSelectedObjectId(newPhotoObj.id);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Move / Update Page Object
  const updatePageObject = (id: string, updates: Partial<PageObject>) => {
    const updated = pageObjects.map((obj) =>
      obj.id === id ? { ...obj, ...updates } : obj
    );
    onUpdateEntry({
      ...entry,
      pageObjects: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  // Delete Page Object
  const deletePageObject = (id: string) => {
    const updated = pageObjects.filter((obj) => obj.id !== id);
    onUpdateEntry({
      ...entry,
      pageObjects: updated,
      updatedAt: new Date().toISOString(),
    });
    if (selectedObjectId === id) setSelectedObjectId(null);
  };

  // Dragging Objects on Canvas
  const [dragState, setDragState] = useState<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, obj: PageObject) => {
    e.stopPropagation();
    setSelectedObjectId(obj.id);

    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    setDragState({
      id: obj.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: obj.x,
      origY: obj.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const deltaX = ((e.clientX - dragState.startX) / canvasRect.width) * 100;
    const deltaY = ((e.clientY - dragState.startY) / canvasRect.height) * 100;

    const newX = Math.max(0, Math.min(85, dragState.origX + deltaX));
    const newY = Math.max(0, Math.min(85, dragState.origY + deltaY));

    updatePageObject(dragState.id, { x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setDragState(null);
  };

  const selectedObject = pageObjects.find((o) => o.id === selectedObjectId);

  // Font styling class
  const fontClass =
    fontStyle === "handwritten"
      ? "font-serif italic leading-loose tracking-wide"
      : fontStyle === "editorial"
      ? "font-serif leading-relaxed"
      : "font-sans leading-relaxed";

  return (
    <div
      className="relative flex flex-col h-full min-h-0 select-none overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={() => setSelectedObjectId(null)}
    >
      {/* Top Page Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 sm:px-4 py-1.5 bg-[#FFFDF9]/95 border-b border-amber-200/60 backdrop-blur-xs z-30 shrink-0 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Paper Style Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPaperSelectorOpen(!isPaperSelectorOpen);
              }}
              className="px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
            >
              <Palette className="w-3.5 h-3.5 text-amber-700" />
              <span className="capitalize">{paperStyle} Paper</span>
            </button>

            {isPaperSelectorOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-amber-200 rounded-xl shadow-xl p-1 z-40 space-y-0.5 animate-in fade-in">
                {PAPER_STYLES.map((ps) => (
                  <button
                    key={ps.id}
                    type="button"
                    onClick={() => {
                      handlePaperStyleChange(ps.id);
                      setIsPaperSelectorOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition ${
                      paperStyle === ps.id
                        ? "bg-amber-100 text-amber-950 font-bold"
                        : "text-slate-600 hover:bg-amber-50"
                    }`}
                  >
                    {ps.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Style Toggle */}
          <button
            type="button"
            onClick={() =>
              handleFontStyleChange(
                fontStyle === "handwritten"
                  ? "editorial"
                  : fontStyle === "editorial"
                  ? "serif"
                  : "handwritten"
              )
            }
            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition flex items-center gap-1.5"
            title="Toggle Font Aesthetic"
          >
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <span className="capitalize">{fontStyle} Font</span>
          </button>
        </div>

        {/* Scrapbook Creative Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenStickerDrawer}
            className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center gap-1 shadow-2xs"
          >
            <span>🎀</span>
            <span>Stickers</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition flex items-center gap-1 shadow-2xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>Add Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={onOpenVoiceModal}
            className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition flex items-center gap-1 shadow-2xs"
          >
            <Mic className="w-3.5 h-3.5 text-amber-600" />
            <span>Narrate</span>
          </button>

          <button
            type="button"
            onClick={onOpenGemini}
            className="group px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-800 hover:from-indigo-600 hover:via-purple-600 hover:to-slate-700 border border-indigo-400/50 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-xs hover:shadow-indigo-500/25"
          >
            <GeminiIcon className="w-3.5 h-3.5" glow={false} />
            <span className="tracking-wide">Ask Gemini</span>
          </button>

          {isSaving && (
            <span className="text-[10px] text-amber-600 font-serif italic flex items-center gap-1 px-1">
              <span>Inking...</span>
            </span>
          )}
        </div>
      </div>

      {/* The Physical Page Canvas */}
      <div
        ref={canvasRef}
        id="diary-page-interactive-canvas"
        className={`relative flex-1 min-h-0 p-4 sm:p-6 lg:p-7 overflow-y-auto ${
          paperStyle === "ruled"
            ? "bg-[#FCFBF7] bg-[linear-gradient(transparent_31px,#E2DFD2_32px)] bg-[size:100%_32px]"
            : paperStyle === "grid"
            ? "bg-[#FCFBF7] bg-[radial-gradient(#CBD5E1_1.2px,transparent_1.2px)] bg-[size:24px_24px]"
            : paperStyle === "vintage"
            ? "bg-[#F7F2E7] shadow-inner"
            : paperStyle === "floral"
            ? "bg-[#FCFAF7]"
            : paperStyle === "scrapbook"
            ? "bg-[#FFF9F2]"
            : "bg-[#FFFDF9]"
        }`}
      >
        {/* Ruled margin line if in ruled mode */}
        {paperStyle === "ruled" && (
          <div className="absolute top-0 bottom-0 left-6 sm:left-10 w-0.5 bg-rose-300/60 pointer-events-none" />
        )}

        {/* Delicate Floral Corner Decoration if floral mode */}
        {paperStyle === "floral" && (
          <div className="absolute top-2 right-2 w-28 h-28 opacity-25 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-rose-300">
              <circle cx="80" cy="20" r="10" />
              <circle cx="65" cy="15" r="8" />
              <circle cx="85" cy="35" r="8" />
            </svg>
          </div>
        )}

        {/* Header Block: Date Stamp, Mood Selector, Tags */}
        <div className="relative z-10 mb-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
            {/* Date Stamp */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-amber-800/80 uppercase">
                {new Date(entry.createdAt).toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {/* Mood Selector Pill */}
            <div className="flex items-center gap-1.5">
              <select
                value={entry.mood || "Serene"}
                onChange={(e) => handleMoodChange(e.target.value)}
                className="text-xs bg-white/90 border border-amber-200 rounded-full px-3 py-1 text-slate-700 focus:outline-hidden font-medium shadow-2xs"
              >
                {MOODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={onDeleteEntry}
                title="Tear out this page"
                className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Page Title */}
          <input
            type="text"
            value={entry.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Title of this page..."
            className="w-full text-xl sm:text-2xl font-serif font-bold text-slate-800 bg-transparent border-none focus:outline-hidden placeholder:text-slate-300 tracking-tight"
          />

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {entry.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-amber-100/70 text-amber-900 border border-amber-200/60"
              >
                <span>#{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-rose-600"
                >
                  &times;
                </button>
              </span>
            ))}

            {isTagInputOpen ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="tag..."
                  autoFocus
                  className="w-20 text-[10px] bg-white border border-amber-200 rounded-full px-2 py-0.5 text-slate-800 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="text-xs text-amber-700 hover:text-amber-900"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsTagInputOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-slate-500 hover:text-amber-800 border border-dashed border-slate-300 hover:border-amber-300"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>Add Tag</span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Journal Text Writing Area */}
        <div className="relative z-10 min-h-[200px]">
          <textarea
            value={entry.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Write your unfiltered thoughts here... The ink will preserve your truth."
            rows={10}
            className={`w-full text-sm sm:text-base text-slate-800 bg-transparent border-none focus:outline-hidden resize-none placeholder:text-slate-300 ${fontClass}`}
          />
        </div>

        {/* Pinned Gemini Reflection Note on Page (if present) */}
        {parsedReflection && (
          <div
            className={`relative z-20 my-6 max-w-md ml-auto p-4 rounded-xl ${activeTheme.geminiNote.bg} border ${activeTheme.geminiNote.border} shadow-md transform rotate-1 space-y-2 transition-all duration-300`}
          >
            {/* Themed Push Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-none drop-shadow-xs">
              <Pin className={`w-5 h-5 fill-current ${activeTheme.geminiNote.pinColor}`} />
            </div>

            <div className="flex items-center justify-between border-b border-black/10 pb-1.5 text-xs font-serif font-bold">
              <span className={`flex items-center gap-1.5 ${activeTheme.geminiNote.textColor}`}>
                <GeminiIcon className="w-3.5 h-3.5" glow={false} />
                <span>Gemini Reflection Note</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 text-slate-800 font-sans font-medium border border-black/5">
                {parsedReflection.emotionalTone}
              </span>
            </div>

            <p className={`text-xs font-serif italic ${activeTheme.geminiNote.textColor} leading-relaxed whitespace-pre-wrap`}>
              {parsedReflection.reflection}
            </p>

            {parsedReflection.coreInsight && (
              <div className="p-2 bg-white/60 rounded-lg text-[11px] text-slate-800 font-serif border border-black/5">
                <strong>Insight:</strong> {parsedReflection.coreInsight}
              </div>
            )}

            {parsedReflection.mindfulPrompt && (
              <div className="text-[10px] text-slate-600 font-serif italic">
                &ldquo;{parsedReflection.mindfulPrompt}&rdquo;
              </div>
            )}
          </div>
        )}

        {/* Freeform Scrapbook Layer (Stickers & Photos) */}
        {pageObjects.map((obj) => {
          const isSelected = obj.id === selectedObjectId;
          const stickerDef = obj.assetKey
            ? STICKERS.find((s) => s.id === obj.assetKey)
            : null;

          return (
            <div
              key={obj.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedObjectId(obj.id);
              }}
              onPointerDown={(e) => handlePointerDown(e, obj)}
              style={{
                position: "absolute",
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                width: `${obj.width}px`,
                transform: `rotate(${obj.rotation}deg)`,
                zIndex: obj.zIndex + (isSelected ? 50 : 20),
                cursor: "grab",
              }}
              className={`group transition-shadow select-none ${
                isSelected ? "ring-2 ring-rose-400 ring-offset-2" : ""
              }`}
            >
              {/* If Photo */}
              {obj.type === "photo" && obj.url && (
                <div
                  className={`relative flex flex-col p-2 bg-white rounded-md shadow-lg border ${
                    obj.frameStyle === "polaroid"
                      ? "pb-6 border-slate-200"
                      : obj.frameStyle === "taped"
                      ? "border-amber-200"
                      : "border-slate-300"
                  }`}
                >
                  {/* Washi Tape Corner if taped */}
                  {obj.frameStyle === "taped" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-rose-200/80 shadow-xs border-y border-rose-300/60 transform -rotate-2 pointer-events-none" />
                  )}

                  {/* Brass Pin if pinned */}
                  {obj.frameStyle === "pinned" && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-500 border border-amber-700 shadow-xs pointer-events-none" />
                  )}

                  <img
                    src={obj.url}
                    alt="Memory"
                    className="w-full h-auto object-cover rounded-xs"
                    draggable={false}
                  />

                  {/* Handwritten Polaroid Caption */}
                  {obj.caption ? (
                    <p className="mt-2 text-[11px] font-serif italic text-slate-700 text-center truncate">
                      {obj.caption}
                    </p>
                  ) : isSelected ? (
                    <input
                      type="text"
                      placeholder="Add caption..."
                      value={obj.caption || ""}
                      onChange={(e) => updatePageObject(obj.id, { caption: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 text-[10px] font-serif italic text-center bg-transparent border-b border-slate-200 focus:outline-hidden text-slate-700"
                    />
                  ) : null}
                </div>
              )}

              {/* If Sticker */}
              {obj.type === "sticker" && (
                <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
                  {stickerDef ? (
                    stickerDef.render()
                  ) : (
                    <span className="text-3xl">✨</span>
                  )}
                </div>
              )}

              {/* Selected Object Manipulation Controls Overlay */}
              {isSelected && (
                <div
                  className="absolute -top-7 right-0 flex items-center gap-1 bg-white/95 border border-slate-200 rounded-full px-1.5 py-0.5 shadow-md text-slate-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Rotate */}
                  <button
                    type="button"
                    onClick={() =>
                      updatePageObject(obj.id, {
                        rotation: ((obj.rotation + 15) % 360),
                      })
                    }
                    title="Rotate"
                    className="p-1 hover:text-rose-600 rounded-full"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>

                  {/* Scale Up */}
                  <button
                    type="button"
                    onClick={() =>
                      updatePageObject(obj.id, {
                        width: Math.min(300, obj.width + 20),
                      })
                    }
                    title="Enlarge"
                    className="p-1 hover:text-rose-600 rounded-full"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>

                  {/* Scale Down */}
                  <button
                    type="button"
                    onClick={() =>
                      updatePageObject(obj.id, {
                        width: Math.max(50, obj.width - 20),
                      })
                    }
                    title="Shrink"
                    className="p-1 hover:text-rose-600 rounded-full"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => deletePageObject(obj.id)}
                    title="Remove from page"
                    className="p-1 hover:text-rose-600 rounded-full text-rose-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
