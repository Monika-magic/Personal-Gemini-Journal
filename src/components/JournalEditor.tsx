import React, { useState, useEffect } from "react";
import { JournalEntry, ChatMessage, JournalSummary } from "../types";
import { ChatSession } from "./ChatSession";
import { JournalSummaryView } from "./JournalSummaryView";
import { useAuth } from "../context/AuthContext";
import { GeminiIcon } from "./GeminiIcon";
import {
  Save,
  Check,
  Tag,
  Smile,
  Lightbulb,
  SplitSquareVertical,
  Layers,
  Clock,
  X,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface JournalEditorProps {
  entry: JournalEntry;
  onSaveEntry: (entry: JournalEntry) => Promise<void>;
  onSaveSummary: (summary: JournalSummary) => Promise<void>;
  isSaving: boolean;
}

const AVAILABLE_MOODS = [
  { label: "🌸 Serene", value: "🌸 Serene" },
  { label: "☀️ Joyful", value: "☀️ Joyful" },
  { label: "💭 Reflective", value: "💭 Reflective" },
  { label: "🌿 Grounded", value: "🌿 Grounded" },
  { label: "💡 Inspired", value: "💡 Inspired" },
  { label: "🌊 Deep", value: "🌊 Deep" },
  { label: "🌧️ Tender", value: "🌧️ Tender" },
  { label: "🕊️ Peaceful", value: "🕊️ Peaceful" },
];

export const JournalEditor: React.FC<JournalEditorProps> = ({
  entry,
  onSaveEntry,
  onSaveSummary,
  isSaving,
}) => {
  const { displayName } = useAuth();
  const [title, setTitle] = useState<string>(entry.title);
  const [content, setContent] = useState<string>(entry.content);
  const [mood, setMood] = useState<string>(entry.mood || "🌿 Grounded");
  const [tags, setTags] = useState<string[]>(entry.tags || []);
  const [tagInput, setTagInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>(entry.messages || []);
  const [activeTab, setActiveTab] = useState<"write" | "chat" | "split" | "synthesis">("split");

  const [summaryData, setSummaryData] = useState<JournalSummary | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Prompt suggestions modal
  const [showPromptsModal, setShowPromptsModal] = useState<boolean>(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState<boolean>(false);

  // Sync state when active entry changes
  useEffect(() => {
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || "🌿 Grounded");
    setTags(entry.tags || []);
    setMessages(entry.messages || []);
    setSummaryData(null);
  }, [entry.id]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, "");
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    const updatedEntry: JournalEntry = {
      ...entry,
      title: title.trim() || "Untitled Reflection",
      content,
      mood,
      tags,
      messages,
      updatedAt: new Date().toISOString(),
    };

    await onSaveEntry(updatedEntry);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleGenerateSummary = async () => {
    setIsSynthesizing(true);
    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Untitled Reflection",
          content,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to synthesize journal entry");
      }

      const data = await response.json();
      const newSummary: JournalSummary = {
        id: "sum-" + Date.now(),
        userId: entry.userId,
        entryId: entry.id,
        title: `Synthesis: ${title || "Reflection"}`,
        keyThemes: data.keyThemes || [],
        insights: data.summary || "",
        actionItems: data.actionItems || [],
        emotionalTone: data.emotionalTone || mood,
        createdAt: new Date().toISOString(),
      };

      setSummaryData(newSummary);
      setActiveTab("synthesis");
    } catch (err) {
      console.error("Summary error:", err);
      alert("Unable to generate summary. Please check connection and try again.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleFetchPrompts = async () => {
    setShowPromptsModal(true);
    setIsLoadingPrompts(true);
    try {
      const response = await fetch("/api/gemini/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: mood.split(" ")[1] || mood,
          topic: tags.join(", ") || title,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestedPrompts(data.prompts || []);
      }
    } catch (err) {
      console.error("Prompts error:", err);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  const applyPrompt = (prompt: string) => {
    setContent((prev) => (prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`));
    setShowPromptsModal(false);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] text-slate-800 overflow-hidden">
      {/* Personalized Greeting Header */}
      <div className="px-5 py-3.5 bg-white border-b border-purple-100/70 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Welcome back, {displayName} 🌸</span>
          </h2>
          <p className="text-xs text-slate-500">
            Take a breath, reflect freely, and let your thoughts unfold.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "write"
                ? "bg-white text-purple-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Journal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("split")}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "split"
                ? "bg-white text-purple-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "chat"
                ? "bg-white text-purple-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GeminiIcon className="w-3.5 h-3.5" />
            <span>Gemini Chat ({messages.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("synthesis")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "synthesis"
                ? "bg-white text-purple-700 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Synthesis</span>
          </button>
        </div>

        {/* Action Toolbar Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="inspire-prompts-button"
            onClick={handleFetchPrompts}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50/80 hover:bg-purple-100/80 text-purple-700 text-xs font-medium border border-purple-200/80 transition-all shadow-2xs"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Inspire Me ✨</span>
          </button>

          <button
            type="button"
            id="synthesize-button"
            onClick={handleGenerateSummary}
            disabled={isSynthesizing || (!content && messages.length === 0)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-purple-50/60 disabled:opacity-40 text-purple-700 text-xs font-medium border border-purple-200 shadow-2xs transition-all"
          >
            <GeminiIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Synthesize</span>
          </button>

          <button
            type="button"
            id="save-journal-entry-button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-95 disabled:opacity-50 text-white text-xs font-medium transition-all shadow-sm shadow-purple-500/15"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : "Save Entry"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 overflow-hidden p-4 sm:p-6">
        <div className="h-full max-w-7xl mx-auto flex flex-col">
          {/* Metadata Card: Title, Mood Chips, Tags */}
          <div className="bg-white rounded-3xl p-5 border border-purple-100/80 shadow-xs mb-4 space-y-3 shrink-0">
            {/* Title Input */}
            <input
              id="journal-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind today? 🌷"
              className="w-full text-xl sm:text-2xl font-serif bg-transparent border-none text-slate-900 placeholder-slate-400 focus:outline-none tracking-tight font-medium"
            />

            {/* Mood selector chips & tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
              {/* Mood selector chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-1">
                  <Smile className="w-3.5 h-3.5 text-purple-500" />
                  <span>Mood:</span>
                </span>
                {AVAILABLE_MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    className={`text-xs px-3 py-1 rounded-xl transition-all font-medium ${
                      mood === m.value
                        ? "bg-purple-100 text-purple-800 border border-purple-300 shadow-2xs scale-102"
                        : "bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-purple-50/50 hover:text-slate-800"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Tags list */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100/80 font-medium"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-500 ml-0.5"
                    >
                      &times;
                    </button>
                  </span>
                ))}

                <input
                  id="journal-add-tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="+ tag (Enter)"
                  className="bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-24"
                />
              </div>
            </div>
          </div>

          {/* Body Content based on activeTab */}
          <div className="flex-1 min-h-0">
            {activeTab === "synthesis" ? (
              <div className="h-full overflow-y-auto pr-1">
                <JournalSummaryView
                  summary={summaryData}
                  onGenerateSummary={handleGenerateSummary}
                  onSaveSummary={onSaveSummary}
                  isGenerating={isSynthesizing}
                  canGenerate={Boolean(content || messages.length > 0)}
                />
              </div>
            ) : activeTab === "split" ? (
              <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Journal Writing Card */}
                <div className="flex flex-col h-full bg-white rounded-3xl border border-purple-100/80 shadow-xs p-5">
                  <textarea
                    id="journal-content-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write freely... what did you discover today? How did you respond to challenges? What are you grateful for? 🌷"
                    className="flex-1 w-full bg-transparent resize-none focus:outline-none text-slate-700 text-sm leading-relaxed placeholder:text-slate-400 font-sans"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{wordCount} words • {content.length} characters</span>
                    </div>
                    <span className="text-emerald-700 font-medium">Firestore isolated partition</span>
                  </div>
                </div>

                {/* Gemini Chat Session */}
                <div className="h-full">
                  <ChatSession
                    messages={messages}
                    onMessagesChange={setMessages}
                    entryTitle={title}
                    entryContent={content}
                    entryMood={mood}
                  />
                </div>
              </div>
            ) : activeTab === "write" ? (
              <div className="flex flex-col h-full bg-white rounded-3xl border border-purple-100/80 shadow-xs p-6">
                <textarea
                  id="journal-content-textarea-fullscreen"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write freely... what did you discover today? How did you respond to challenges? What are you grateful for? 🌷"
                  className="flex-1 w-full bg-transparent resize-none focus:outline-none text-slate-700 text-base leading-relaxed placeholder:text-slate-400 font-sans"
                />
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{wordCount} words • {content.length} characters</span>
                  </div>
                  <span className="text-emerald-700 font-medium">Firestore UID Private Partition</span>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <ChatSession
                  messages={messages}
                  onMessagesChange={setMessages}
                  entryTitle={title}
                  entryContent={content}
                  entryMood={mood}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompts Modal */}
      {showPromptsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white border border-purple-100 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <GeminiIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Mindful Reflection Inquiries ✨
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPromptsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Gemini crafted reflection prompts tailored to your current mood ({mood}):
            </p>

            {isLoadingPrompts ? (
              <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
                <span>Crafting thoughtful reflection questions...</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {suggestedPrompts.length > 0 ? (
                  suggestedPrompts.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => applyPrompt(p)}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200/80 hover:border-purple-200 cursor-pointer text-xs text-slate-700 hover:text-purple-900 transition-all leading-relaxed"
                    >
                      "{p}"
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No prompts generated yet.
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowPromptsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
