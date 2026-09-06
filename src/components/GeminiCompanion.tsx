import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Wand2, BookOpen, Quote, Heart, ArrowRight } from "lucide-react";
import { JournalEntry, ChatMessage, GeminiReflectionData } from "../types";
import { GeminiIcon } from "./GeminiIcon";

interface GeminiCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  entry: JournalEntry;
  onUpdateMessages: (messages: ChatMessage[]) => void;
  onSaveReflection: (reflectionData: GeminiReflectionData) => void;
}

export const GeminiCompanion: React.FC<GeminiCompanionProps> = ({
  isOpen,
  onClose,
  entry,
  onUpdateMessages,
  onSaveReflection,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(entry.messages || []);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReflecting, setIsReflecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(entry.messages || []);
  }, [entry.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  // Extract photo captions if any
  const photoCaptions = (entry.pageObjects || [])
    .filter((obj) => obj.type === "photo" && obj.caption)
    .map((obj) => obj.caption as string);

  const handleSendMessage = async (promptToSend?: string) => {
    const textToSend = (promptToSend || input).trim();
    if (!textToSend || isLoading) return;

    setError(null);
    setInput("");

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    onUpdateMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          userPrompt: textToSend,
          entryContext: {
            title: entry.title,
            mood: entry.mood,
            contentSnippet: entry.content ? entry.content.slice(0, 400) : "",
            photoCaptions,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to reach Gemini.");
      }

      const modelMessage: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        role: "model",
        content: data.text,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [...newHistory, modelMessage];
      setMessages(updatedHistory);
      onUpdateMessages(updatedHistory);
    } catch (err: any) {
      console.error("Gemini chat error:", err);
      setError(err.message || "Could not generate reflection right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReflectOnPage = async () => {
    if (!entry.content && !entry.title) {
      setError("Please write something on this diary page first!");
      return;
    }

    setIsReflecting(true);
    setError(null);

    try {
      const res = await fetch("/api/gemini/reflect-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags,
          photoCaptions,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate reflection.");
      }

      onSaveReflection(data);
      // Also add a gentle message in chat
      const modelNote: ChatMessage = {
        id: "msg-" + Date.now(),
        role: "model",
        content: `✨ I have penned a reflection note for "${entry.title}". You will find it pinned to your diary page!`,
        timestamp: new Date().toISOString(),
      };
      const updated = [...messages, modelNote];
      setMessages(updated);
      onUpdateMessages(updated);
    } catch (err: any) {
      console.error("Reflect on page error:", err);
      setError(err.message || "Failed to generate reflection.");
    } finally {
      setIsReflecting(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 max-w-[92vw] bg-[#FFFDF9] border-l border-purple-200/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header with Gemini gradient */}
      <div className="px-5 py-4 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50/80 via-rose-50/50 to-indigo-50/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-sm p-1.5">
            <GeminiIcon className="w-full h-full text-white" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-slate-800 flex items-center gap-1.5">
              <span>Gemini Companion</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            </h3>
            <p className="text-[11px] text-slate-500">Living quietly inside your diary</p>
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

      {/* Entry context indicator */}
      <div className="px-4 py-2 bg-purple-50/40 border-b border-purple-100/70 flex items-center justify-between text-xs">
        <span className="font-serif italic text-slate-600 truncate max-w-[200px]">
          &ldquo;{entry.title || "Current Page"}&rdquo;
        </span>
        <button
          type="button"
          disabled={isReflecting}
          onClick={handleReflectOnPage}
          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs transition flex items-center gap-1 disabled:opacity-50"
        >
          <Wand2 className="w-3 h-3 text-purple-600" />
          <span>{isReflecting ? "Reflecting..." : "Reflect on Page"}</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.length === 0 ? (
          <div className="py-6 px-4 text-center space-y-3 bg-purple-50/30 rounded-2xl border border-purple-100/60">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="font-serif font-medium text-slate-700 text-sm">
              I am here to reflect with you.
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
              Ask about patterns in your writing, talk through a difficult feeling, or explore what today meant to you.
            </p>

            <div className="pt-2 space-y-1.5">
              {[
                "What emotions stand out in today's entry?",
                "Help me reframe what I wrote about.",
                "What question should I ask myself tonight?",
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  className="w-full text-left p-2 rounded-xl bg-white border border-purple-100 hover:border-purple-300 text-[11px] text-purple-900 transition flex items-center justify-between shadow-2xs group"
                >
                  <span className="truncate">{suggestion}</span>
                  <ArrowRight className="w-3 h-3 text-purple-400 group-hover:text-purple-600 transition" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-br-xs shadow-sm"
                      : "bg-white border border-purple-100/90 text-slate-800 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans text-xs">{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-purple-100/90 max-w-[80%] shadow-2xs">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-purple-700 italic font-serif">Contemplating your thoughts...</span>
          </div>
        )}

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
            {error}
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-purple-100 bg-[#FFFDF9]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk with Gemini about this entry..."
            disabled={isLoading}
            className="flex-1 text-xs bg-purple-50/30 border border-purple-200/80 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-300"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white flex items-center justify-center transition disabled:opacity-40 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
