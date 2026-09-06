import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { ChatMessage } from "../types";
import { Send, Trash2, Lightbulb, User } from "lucide-react";
import { GeminiIcon } from "./GeminiIcon";

interface ChatSessionProps {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
  entryTitle: string;
  entryContent: string;
  entryMood: string;
}

export const ChatSession: React.FC<ChatSessionProps> = ({
  messages,
  onMessagesChange,
  entryTitle,
  entryContent,
  entryMood,
}) => {
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isGenerating) return;

    setChatError(null);
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    onMessagesChange(updatedMessages);
    setInputPrompt("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: userMsg.content,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          entryContext: {
            title: entryTitle,
            content: entryContent,
            mood: entryMood,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-ai",
        role: "model",
        content: data.text || "Thank you for sharing your thoughts.",
        timestamp: new Date().toISOString(),
      };

      onMessagesChange([...updatedMessages, modelMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setChatError(err.message || "Failed to reach Gemini. Please check connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear current conversation with Gemini?")) {
      onMessagesChange([]);
    }
  };

  const reflectionPrompts = [
    "Ask me a thoughtful question to deepen this reflection 🌷",
    "Help me unpack what emotions I might be holding back 🌸",
    "What patterns do you notice in my thoughts? 💭",
    "Help me formulate a positive reframing for this situation ✨",
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-purple-100/90 shadow-sm overflow-hidden">
      {/* Gemini Chat Header */}
      <div className="px-4 py-3 border-b border-purple-100/80 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border border-purple-100 shadow-xs flex items-center justify-center">
            <GeminiIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-800">Gemini Companion</h3>
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-purple-100/80 text-purple-700">
                Flash
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Reflective dialogue & mindful inquiry</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            id="clear-chat-button"
            onClick={clearChat}
            title="Clear conversation"
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-white to-[#FAF9F7]/60">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 border border-purple-100 flex items-center justify-center shadow-xs">
              <GeminiIcon className="w-6 h-6" />
            </div>
            <div className="max-w-xs">
              <p className="text-sm font-serif font-semibold text-slate-800">
                Reflect Together with Gemini ✨
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Bounce thoughts, unpack your feelings, or explore what to write about. Gemini reads your entry to guide you with empathy.
              </p>
            </div>

            {/* Quick suggested prompts */}
            <div className="w-full space-y-2 pt-1 max-w-sm">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">
                Reflective Inquiries
              </span>
              {reflectionPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl bg-white hover:bg-purple-50/70 border border-slate-200/80 hover:border-purple-200 text-slate-700 hover:text-purple-900 transition-all shadow-2xs leading-relaxed"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "model" && (
                <div className="w-7 h-7 rounded-xl bg-white border border-purple-100 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                  <GeminiIcon className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-medium rounded-tr-xs shadow-xs"
                    : "bg-white text-slate-800 border border-purple-100 rounded-tl-xs shadow-xs"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="markdown-body space-y-2 prose prose-slate prose-xs">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                )}
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    msg.role === "user" ? "text-purple-100" : "text-slate-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}

        {isGenerating && (
          <div className="flex gap-2.5 items-center text-slate-500 text-xs">
            <div className="w-7 h-7 rounded-xl bg-white border border-purple-100 shadow-xs flex items-center justify-center shrink-0">
              <GeminiIcon className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-white border border-purple-100 rounded-2xl px-4 py-2.5 rounded-tl-xs shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[11px] font-medium text-purple-700">Gemini is reflecting...</span>
            </div>
          </div>
        )}

        {chatError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {chatError}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-purple-100/80 bg-white">
        <div className="relative flex items-center">
          <textarea
            id="chat-user-prompt-input"
            rows={2}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind with Gemini... (Enter to send)"
            disabled={isGenerating}
            className="w-full pl-3.5 pr-11 py-2.5 bg-slate-50/90 border border-slate-200/90 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none transition-all placeholder:text-slate-400"
          />
          <button
            type="button"
            id="chat-send-message-button"
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isGenerating}
            className="absolute right-2.5 bottom-2.5 p-2 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:opacity-95 disabled:opacity-30 text-white transition-all shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
          <span>Shift+Enter for new line</span>
          <span className="flex items-center gap-1 text-purple-600 font-medium">
            <GeminiIcon className="w-2.5 h-2.5" />
            <span>Server-side Gemini 3.8 Flash</span>
          </span>
        </div>
      </div>
    </div>
  );
};
