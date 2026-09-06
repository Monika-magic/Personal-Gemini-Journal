import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Check, X, Sparkles, Image as ImageIcon, Volume2 } from "lucide-react";
import { PageObject } from "../types";

interface VoiceNarrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToText: (narration: string) => void;
  onAttachToPhoto: (photoId: string, narration: string) => void;
  photos: PageObject[];
  selectedPhotoId?: string | null;
}

export const VoiceNarrationModal: React.FC<VoiceNarrationModalProps> = ({
  isOpen,
  onClose,
  onInsertToText,
  onAttachToPhoto,
  photos,
  selectedPhotoId,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [targetPhotoId, setTargetPhotoId] = useState<string>(selectedPhotoId || (photos.length > 0 ? photos[0].id : ""));
  const [statusNote, setStatusNote] = useState<string>("");

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (selectedPhotoId) {
      setTargetPhotoId(selectedPhotoId);
    } else if (photos.length > 0 && !targetPhotoId) {
      setTargetPhotoId(photos[0].id);
    }
  }, [selectedPhotoId, photos]);

  useEffect(() => {
    // Check browser speech recognition API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setStatusNote("Speech recognition is not natively supported in this browser engine. You can type your spoken narration directly below!");
    }
  }, []);

  const handleStartListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        setStatusNote("Listening carefully... Speak your story naturally.");
      };

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + " ";
        }
        setTranscript(currentText.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error === "not-allowed") {
          setStatusNote("Microphone permission was not granted. You can type your narrative below.");
        } else {
          setStatusNote(`Microphone note: ${event.error}. You can continue typing.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Could not start speech recognition:", err);
      setIsRecording(false);
      setStatusNote("Microphone could not be engaged in this sandboxed environment. Please enter your narrative below.");
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleInsertText = () => {
    if (!transcript.trim()) return;
    onInsertToText(transcript.trim());
    onClose();
    setTranscript("");
  };

  const handleAttachPhoto = () => {
    if (!transcript.trim() || !targetPhotoId) return;
    onAttachToPhoto(targetPhotoId, transcript.trim());
    onClose();
    setTranscript("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border border-amber-200/80 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50/60 to-rose-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-800">🎙️ Tell the Story</h3>
              <p className="text-[11px] text-slate-500">Narrate a memory or attach a voice story to a photo</p>
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Microphone interaction button */}
          <div className="flex flex-col items-center justify-center py-4 bg-amber-50/40 rounded-xl border border-dashed border-amber-200">
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopListening}
                className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg animate-pulse transition transform hover:scale-105"
              >
                <MicOff className="w-7 h-7" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartListening}
                className="w-16 h-16 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center shadow-md transition transform hover:scale-105"
              >
                <Mic className="w-7 h-7" />
              </button>
            )}

            <p className="mt-3 text-xs font-medium text-slate-700">
              {isRecording ? "Listening... (tap to finish)" : "Tap microphone to narrate"}
            </p>
            {statusNote && (
              <p className="mt-1 text-[11px] text-amber-800/80 px-4 text-center max-w-sm">
                {statusNote}
              </p>
            )}
          </div>

          {/* Transcript / Story Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Your Story / Narration</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              </label>
              {transcript && (
                <button
                  type="button"
                  onClick={() => setTranscript("")}
                  className="text-[11px] text-slate-400 hover:text-rose-600"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your spoken words will appear here. You can also type or edit freely..."
              className="w-full text-xs font-serif text-slate-800 bg-[#FAF7F0] border border-amber-200/90 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-rose-300 resize-none leading-relaxed"
            />
          </div>

          {/* Photo attachment selector if photos exist */}
          {photos.length > 0 && (
            <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                <span>Attach to a Photo on this page:</span>
              </label>
              <select
                value={targetPhotoId}
                onChange={(e) => setTargetPhotoId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
              >
                {photos.map((p, idx) => (
                  <option key={p.id} value={p.id}>
                    Photo #{idx + 1} {p.caption ? `("${p.caption.slice(0, 25)}...")` : `(${p.frameStyle || "Polaroid"})`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-3.5 bg-amber-50/40 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 transition"
          >
            Discard
          </button>

          <div className="flex items-center gap-2">
            {photos.length > 0 && (
              <button
                type="button"
                disabled={!transcript.trim() || !targetPhotoId}
                onClick={handleAttachPhoto}
                className="px-3 py-1.5 text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg transition disabled:opacity-40 flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Attach as Caption</span>
              </button>
            )}

            <button
              type="button"
              disabled={!transcript.trim()}
              onClick={handleInsertText}
              className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition disabled:opacity-40 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Insert into Diary Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
