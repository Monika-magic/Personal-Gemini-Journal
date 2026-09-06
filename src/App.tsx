import React, { useState, useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthModal } from "./components/AuthModal";
import { Header } from "./components/Header";
import { SidebarHistory } from "./components/SidebarHistory";
import { JournalEditor } from "./components/JournalEditor";
import { DisplayNameModal } from "./components/DisplayNameModal";
import { DiaryCover } from "./components/DiaryCover";
import { DiaryBook } from "./components/DiaryBook";
import { StickerDrawer } from "./components/StickerDrawer";
import { VoiceNarrationModal } from "./components/VoiceNarrationModal";
import { GeminiCompanion } from "./components/GeminiCompanion";
import { DiaryIndexModal } from "./components/DiaryIndexModal";
import { MemoriesModal } from "./components/MemoriesModal";
import { FutureLettersModal } from "./components/FutureLettersModal";
import { IntentionsDrawer } from "./components/IntentionsDrawer";
import { ThemeEnvironment } from "./components/themes/ThemeEnvironment";
import { ThemeSelectorModal } from "./components/ThemeSelectorModal";
import { ambientAudio } from "./utils/ambientAudio";
import {
  JournalEntry,
  JournalSummary,
  Intention,
  FutureLetter,
  CoverConfig,
  GeminiReflectionData,
  PageObject,
  DiaryThemeId,
} from "./types";
import {
  db,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection,
} from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { Menu, X, AlertCircle, BookOpen, LayoutList } from "lucide-react";

function createNewEntry(userId: string): JournalEntry {
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return {
    id: "entry-" + Date.now(),
    userId,
    title: `Diary Entry - ${dateStr}`,
    content: "",
    messages: [],
    tags: ["diary"],
    mood: "Serene",
    paperStyle: "ruled",
    fontStyle: "handwritten",
    pageObjects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const JournalMain: React.FC = () => {
  const {
    user,
    userProfile,
    displayName,
    loading: authLoading,
    isNameModalOpen,
    setIsNameModalOpen,
    updateCoverConfig,
    updateTheme,
    updateAmbientSoundPreference,
  } = useAuth();

  // Active theme and preferences from userProfile
  const currentThemeId: DiaryThemeId = userProfile?.coverConfig?.themeId || "classic";
  const ambientSoundEnabled = userProfile?.coverConfig?.ambientSoundEnabled ?? false;

  // Core Entries & Mode
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [isDiaryOpen, setIsDiaryOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"physical" | "classic">("physical");

  // Auxiliary Collections
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [letters, setLetters] = useState<FutureLetter[]>([]);

  // Modals & Drawers
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isStickerDrawerOpen, setIsStickerDrawerOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState<boolean>(false);
  const [isIndexModalOpen, setIsIndexModalOpen] = useState<boolean>(false);
  const [isMemoriesModalOpen, setIsMemoriesModalOpen] = useState<boolean>(false);
  const [isLettersModalOpen, setIsLettersModalOpen] = useState<boolean>(false);
  const [isIntentionsOpen, setIsIntentionsOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // States
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualEditNameOpen, setManualEditNameOpen] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [noticedSuggestion, setNoticedSuggestion] = useState<{
    noticed: boolean;
    quote?: string;
    suggestion?: string;
    suggestedTitle?: string;
    suggestedDescription?: string;
  } | null>(null);

  const noticeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync Ambient Audio with active theme & user preference
  useEffect(() => {
    if (ambientSoundEnabled) {
      ambientAudio
        .playTheme(currentThemeId)
        .then(() => setIsAudioPlaying(true))
        .catch(() => setIsAudioPlaying(false));
    } else {
      ambientAudio.stop();
      setIsAudioPlaying(false);
    }

    return () => {
      ambientAudio.stop();
    };
  }, [currentThemeId, ambientSoundEnabled]);

  const handleToggleAmbientSound = async () => {
    const next = !ambientSoundEnabled;
    await updateAmbientSoundPreference(next);
    if (next) {
      try {
        await ambientAudio.playTheme(currentThemeId);
        setIsAudioPlaying(true);
      } catch {
        setIsAudioPlaying(false);
      }
    } else {
      ambientAudio.stop();
      setIsAudioPlaying(false);
    }
  };

  const handleSelectTheme = async (newThemeId: DiaryThemeId) => {
    await updateTheme(newThemeId);
  };

  // Test Firestore connection on mount
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Real-time listener: Journal Entries
  useEffect(() => {
    if (!user) {
      setEntries([]);
      setActiveEntry(null);
      return;
    }

    const entriesCollectionPath = `users/${user.uid}/entries`;
    const entriesRef = collection(db, "users", user.uid, "entries");
    const q = query(entriesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: JournalEntry[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push(docSnap.data() as JournalEntry);
        });
        setEntries(loaded);

        // If no active entry, choose the latest one or create a fresh one
        setActiveEntry((curr) => {
          if (curr) {
            const existing = loaded.find((e) => e.id === curr.id);
            return existing || curr;
          }
          return loaded.length > 0 ? loaded[loaded.length - 1] : createNewEntry(user.uid);
        });
      },
      (error) => {
        console.error("Firestore entries listener error:", error);
        setErrorMessage("Permission denied or database access error. Verify security rules.");
        try {
          handleFirestoreError(error, OperationType.LIST, entriesCollectionPath);
        } catch {}
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Real-time listener: Intentions
  useEffect(() => {
    if (!user) {
      setIntentions([]);
      return;
    }

    const intentionsRef = collection(db, "users", user.uid, "intentions");
    const q = query(intentionsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: Intention[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push(docSnap.data() as Intention);
        });
        setIntentions(loaded);
      },
      (error) => {
        console.warn("Intentions listener error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Real-time listener: Secret Pocket Letters
  useEffect(() => {
    if (!user) {
      setLetters([]);
      return;
    }

    const lettersRef = collection(db, "users", user.uid, "letters");
    const q = query(lettersRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: FutureLetter[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push(docSnap.data() as FutureLetter);
        });
        setLetters(loaded);
      },
      (error) => {
        console.warn("Letters listener error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Handle Select Entry
  const handleSelectEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setIsDiaryOpen(true);
    setSidebarOpen(false);
  };

  // Handle New Entry
  const handleNewEntry = () => {
    if (!user) return;
    const newEntry = createNewEntry(user.uid);
    setActiveEntry(newEntry);
    setIsDiaryOpen(true);
    setSidebarOpen(false);
  };

  // Handle Save Entry (Firestore User Partitioned)
  const handleSaveEntry = async (entryToSave: JournalEntry) => {
    if (!user) return;
    setIsSaving(true);
    setErrorMessage(null);
    const entryPath = `users/${user.uid}/entries/${entryToSave.id}`;

    try {
      await setDoc(doc(db, "users", user.uid, "entries", entryToSave.id), {
        ...entryToSave,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
      });
      setActiveEntry(entryToSave);

      // Debounced check with /api/gemini/notice for gentle intentions/goals
      if (entryToSave.content && entryToSave.content.length > 50) {
        if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
        noticeTimeoutRef.current = setTimeout(async () => {
          try {
            const res = await fetch("/api/gemini/notice", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: entryToSave.title,
                content: entryToSave.content,
              }),
            });
            const data = await res.json();
            if (data && data.noticed) {
              setNoticedSuggestion(data);
            }
          } catch {}
        }, 3000);
      }
    } catch (err: any) {
      console.error("Save entry error:", err);
      setErrorMessage("Failed to save entry to private Firestore storage.");
      handleFirestoreError(err, OperationType.WRITE, entryPath);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Save Summary (from classic AI summarizer)
  const handleSaveSummary = async (summary: JournalSummary) => {
    if (!user) return;
    const summaryPath = `users/${user.uid}/summaries/${summary.id}`;
    try {
      await setDoc(doc(db, "users", user.uid, "summaries", summary.id), {
        ...summary,
        userId: user.uid,
      });
    } catch (err: any) {
      console.error("Save summary error:", err);
      handleFirestoreError(err, OperationType.WRITE, summaryPath);
    }
  };

  // Handle Delete Entry
  const handleDeleteEntry = async (entryId: string) => {
    if (!user) return;
    const entryPath = `users/${user.uid}/entries/${entryId}`;
    try {
      await deleteDoc(doc(db, "users", user.uid, "entries", entryId));
      const remaining = entries.filter((e) => e.id !== entryId);
      if (activeEntry?.id === entryId) {
        setActiveEntry(remaining.length > 0 ? remaining[remaining.length - 1] : createNewEntry(user.uid));
      }
    } catch (err: any) {
      console.error("Delete entry error:", err);
      setErrorMessage("Failed to delete entry from private Firestore.");
      handleFirestoreError(err, OperationType.DELETE, entryPath);
    }
  };

  // Intentions Operations
  const handleAddIntention = async (title: string, description?: string, targetDate?: string) => {
    if (!user) return;
    const id = "intent-" + Date.now();
    const newIntention: Intention = {
      id,
      userId: user.uid,
      title,
      description,
      status: "active",
      targetDate,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, "users", user.uid, "intentions", id), newIntention);
    } catch (err: any) {
      console.error("Add intention error:", err);
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/intentions/${id}`);
    }
  };

  const handleUpdateIntentionStatus = async (id: string, status: Intention["status"]) => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid, "intentions", id),
        { status },
        { merge: true }
      );
    } catch (err: any) {
      console.error("Update intention error:", err);
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/intentions/${id}`);
    }
  };

  const handleDeleteIntention = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "intentions", id));
    } catch (err: any) {
      console.error("Delete intention error:", err);
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/intentions/${id}`);
    }
  };

  // Secret Pocket Letters Operations
  const handleAddLetter = async (title: string, content: string, unlockDate: string) => {
    if (!user) return;
    const id = "letter-" + Date.now();
    const newLetter: FutureLetter = {
      id,
      userId: user.uid,
      title,
      content,
      unlockDate,
      sealed: true,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, "users", user.uid, "letters", id), newLetter);
    } catch (err: any) {
      console.error("Add letter error:", err);
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/letters/${id}`);
    }
  };

  const handleUnsealLetter = async (id: string) => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid, "letters", id),
        { sealed: false },
        { merge: true }
      );
    } catch (err: any) {
      console.error("Unseal letter error:", err);
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/letters/${id}`);
    }
  };

  // Add Sticker to Active Page
  const handleAddStickerToActivePage = (stickerId: string) => {
    if (!activeEntry) return;
    const newStickerObj: PageObject = {
      id: "obj-" + Date.now(),
      type: "sticker",
      assetKey: stickerId,
      x: 35 + (Math.random() - 0.5) * 20,
      y: 35 + (Math.random() - 0.5) * 20,
      width: 80,
      height: 80,
      rotation: (Math.random() - 0.5) * 20,
      zIndex: (activeEntry.pageObjects?.length || 0) + 1,
    };
    const updated = [...(activeEntry.pageObjects || []), newStickerObj];
    handleSaveEntry({
      ...activeEntry,
      pageObjects: updated,
    });
  };

  // Voice Narration handlers
  const handleVoiceInsertText = (text: string) => {
    if (!activeEntry) return;
    const separator = activeEntry.content ? "\n\n" : "";
    handleSaveEntry({
      ...activeEntry,
      content: activeEntry.content + separator + text,
    });
  };

  const handleVoiceAttachToPhoto = (photoId: string, caption: string) => {
    if (!activeEntry) return;
    const updatedObjects = (activeEntry.pageObjects || []).map((obj) =>
      obj.id === photoId ? { ...obj, caption } : obj
    );
    handleSaveEntry({
      ...activeEntry,
      pageObjects: updatedObjects,
    });
  };

  // Gemini Reflection Handler
  const handleSaveGeminiReflection = (reflectionData: GeminiReflectionData) => {
    if (!activeEntry) return;
    handleSaveEntry({
      ...activeEntry,
      geminiReflection: JSON.stringify(reflectionData),
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center text-slate-700 space-y-3">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-serif font-medium text-amber-900">
          Unbinding your personal diary ✨...
        </p>
      </div>
    );
  }

  if (!user) {
    return <AuthModal />;
  }

  // Photos on active page
  const activePhotos = (activeEntry?.pageObjects || []).filter((o) => o.type === "photo");

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden bg-[#FAF7F2] text-slate-800 antialiased selection:bg-rose-200 selection:text-rose-900">
      {/* Top Navigation Header */}
      <Header
        onNewEntry={handleNewEntry}
        onOpenEditName={() => setManualEditNameOpen(true)}
        themeId={currentThemeId}
        onOpenThemesModal={() => setIsThemeModalOpen(true)}
        ambientSoundPlaying={isAudioPlaying}
        onToggleAmbientSound={handleToggleAmbientSound}
      />

      {/* View Mode Bar: Allows seamless toggle between Physical Book & Classic Workspace */}
      <div className="shrink-0 bg-white/80 border-b border-amber-200/60 px-4 py-1.5 flex items-center justify-between text-xs backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("physical")}
            className={`px-3 py-1 rounded-xl font-medium transition flex items-center gap-1.5 ${
              viewMode === "physical"
                ? "bg-rose-500 text-white shadow-2xs font-semibold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Physical Diary Experience</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("classic")}
            className={`px-3 py-1 rounded-xl font-medium transition flex items-center gap-1.5 ${
              viewMode === "classic"
                ? "bg-purple-600 text-white shadow-2xs font-semibold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Classic Workspace</span>
          </button>
        </div>

        {viewMode === "physical" && isDiaryOpen && (
          <button
            type="button"
            onClick={() => setIsDiaryOpen(false)}
            className="text-amber-900 hover:text-amber-950 font-serif italic text-xs underline underline-offset-4"
          >
            View Cover &rarr;
          </button>
        )}
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="shrink-0 bg-rose-50 border-b border-rose-200 text-rose-800 px-4 py-2.5 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-800 p-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Content Area: Flexes and bounds height strictly to viewport */}
      <main className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
        <ThemeEnvironment
          themeId={currentThemeId}
          reducedMotion={reducedMotion}
          className="h-full w-full flex-1 min-h-0 flex flex-col overflow-hidden"
        >
          {viewMode === "physical" ? (
            /* Digital Physical Diary View */
            !isDiaryOpen ? (
              /* 1. Physical Diary Cover (Closed Book) */
              <DiaryCover
                displayName={displayName}
                coverConfig={userProfile?.coverConfig}
                entriesCount={entries.length}
                latestEntry={entries.length > 0 ? entries[entries.length - 1] : null}
                themeId={currentThemeId}
                onOpenDiary={() => setIsDiaryOpen(true)}
                onUpdateCoverConfig={updateCoverConfig}
                onOpenThemesModal={() => setIsThemeModalOpen(true)}
              />
            ) : (
              /* 2. Realistic Open Diary Book Spread */
              activeEntry && (
                <DiaryBook
                  entries={entries}
                  currentEntry={activeEntry}
                  themeId={currentThemeId}
                  onSelectEntry={handleSelectEntry}
                  onUpdateEntry={handleSaveEntry}
                  onNewEntry={handleNewEntry}
                  onDeleteEntry={handleDeleteEntry}
                  onCloseToCover={() => setIsDiaryOpen(false)}
                  onOpenStickerDrawer={() => setIsStickerDrawerOpen(true)}
                  onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                  onOpenGemini={() => setIsGeminiOpen(true)}
                  onOpenIndexModal={() => setIsIndexModalOpen(true)}
                  onOpenMemoriesModal={() => setIsMemoriesModalOpen(true)}
                  onOpenLettersModal={() => setIsLettersModalOpen(true)}
                  onOpenIntentionsDrawer={() => setIsIntentionsOpen(true)}
                  onOpenThemeSelector={() => setIsThemeModalOpen(true)}
                  ambientSoundPlaying={isAudioPlaying}
                  onToggleAmbientSound={handleToggleAmbientSound}
                  isSaving={isSaving}
                />
              )
            )
          ) : (
            /* Classic Workspace Layout (Preserved for compatibility) */
            <div className="flex-1 min-h-0 h-full flex overflow-hidden relative">
              <div className="hidden md:block w-72 lg:w-80 shrink-0 h-full">
                <SidebarHistory
                  entries={entries}
                  activeEntryId={activeEntry?.id || null}
                  onSelectEntry={handleSelectEntry}
                  onDeleteEntry={handleDeleteEntry}
                  userId={user.uid}
                />
              </div>

              <div className="flex-1 min-h-0 h-full overflow-hidden">
                {activeEntry ? (
                  <JournalEditor
                    key={activeEntry.id}
                    entry={activeEntry}
                    onSaveEntry={handleSaveEntry}
                    onSaveSummary={handleSaveSummary}
                    isSaving={isSaving}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                    Select or create a reflection to begin.
                  </div>
                )}
              </div>
            </div>
          )}
        </ThemeEnvironment>
      </main>

      {/* Floating Scrapbook Sticker Studio Drawer */}
      <StickerDrawer
        isOpen={isStickerDrawerOpen}
        onClose={() => setIsStickerDrawerOpen(false)}
        onAddSticker={handleAddStickerToActivePage}
      />

      {/* Voice Narration / Memory Story Modal */}
      <VoiceNarrationModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onInsertToText={handleVoiceInsertText}
        onAttachToPhoto={handleVoiceAttachToPhoto}
        photos={activePhotos}
      />

      {/* Gemini Companion living inside the diary */}
      {activeEntry && (
        <GeminiCompanion
          isOpen={isGeminiOpen}
          onClose={() => setIsGeminiOpen(false)}
          entry={activeEntry}
          onUpdateMessages={(messages) => handleSaveEntry({ ...activeEntry, messages })}
          onSaveReflection={handleSaveGeminiReflection}
        />
      )}

      {/* Table of Contents & Index Modal */}
      <DiaryIndexModal
        isOpen={isIndexModalOpen}
        onClose={() => setIsIndexModalOpen(false)}
        entries={entries}
        currentEntryId={activeEntry?.id}
        onSelectEntry={handleSelectEntry}
        onNewEntry={handleNewEntry}
      />

      {/* Time Capsule & On This Day Memories Modal */}
      <MemoriesModal
        isOpen={isMemoriesModalOpen}
        onClose={() => setIsMemoriesModalOpen(false)}
        entries={entries}
        onSelectEntry={handleSelectEntry}
      />

      {/* Secret Pocket: Letters to Future Self Modal */}
      <FutureLettersModal
        isOpen={isLettersModalOpen}
        onClose={() => setIsLettersModalOpen(false)}
        letters={letters}
        onAddLetter={handleAddLetter}
        onUnsealLetter={handleUnsealLetter}
      />

      {/* Mindful Intentions & "Gemini noticed..." Drawer */}
      <IntentionsDrawer
        isOpen={isIntentionsOpen}
        onClose={() => setIsIntentionsOpen(false)}
        intentions={intentions}
        onAddIntention={handleAddIntention}
        onUpdateStatus={handleUpdateIntentionStatus}
        onDeleteIntention={handleDeleteIntention}
        noticedSuggestion={noticedSuggestion}
        onDismissNoticed={() => setNoticedSuggestion(null)}
      />

      {/* Display Name Modal */}
      <DisplayNameModal
        isOpen={isNameModalOpen || manualEditNameOpen}
        isInitialPrompt={isNameModalOpen}
        onClose={() => {
          setIsNameModalOpen(false);
          setManualEditNameOpen(false);
        }}
      />

      {/* Diary Theme & Atmosphere Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeThemeId={currentThemeId}
        onSelectTheme={handleSelectTheme}
        ambientSoundEnabled={ambientSoundEnabled}
        onToggleAmbientSound={handleToggleAmbientSound}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <JournalMain />
    </AuthProvider>
  );
}
