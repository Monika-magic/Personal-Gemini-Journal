export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export type PhotoFrameStyle = "polaroid" | "taped" | "pinned" | "instant" | "torn" | "scrapbook";

export interface PageObject {
  id: string;
  type: "sticker" | "photo";
  x: number; // percentage 0 - 100 on page
  y: number; // percentage 0 - 100 on page
  width: number; // px width
  height: number; // px height
  rotation: number; // degrees e.g. -15 to 15
  zIndex: number;
  assetKey?: string; // sticker identifier e.g. "flower_rose", "tape_pastel"
  url?: string; // data URL or photo source
  caption?: string; // photo narration or caption
  frameStyle?: PhotoFrameStyle;
}

export type PaperStyle = "plain" | "ruled" | "grid" | "vintage" | "floral" | "scrapbook";
export type FontStyle = "handwritten" | "editorial" | "serif";

export interface GeminiReflectionData {
  reflection: string;
  emotionalTone: string;
  coreInsight: string;
  mindfulPrompt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  messages: ChatMessage[];
  tags: string[];
  mood: string;
  summary?: string;
  pageObjects?: PageObject[];
  paperStyle?: PaperStyle;
  fontStyle?: FontStyle;
  geminiReflection?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalSummary {
  id: string;
  userId: string;
  entryId?: string;
  title: string;
  keyThemes: string[];
  insights: string;
  actionItems: string[];
  emotionalTone: string;
  createdAt: string;
}

export type DiaryThemeId = "classic" | "peacock" | "ocean" | "galaxy" | "windy_leaves";

export interface CoverConfig {
  color: "blush" | "lavender" | "sage" | "navy" | "cream" | "espresso";
  texture: "leather" | "linen" | "velvet" | "embossed";
  title?: string;
  subtitle?: string;
  charm?: "star" | "lotus" | "moon" | "clover" | "butterfly";
  themeId?: DiaryThemeId;
  ambientSoundEnabled?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  coverConfig?: CoverConfig;
  createdAt: string;
  updatedAt?: string;
}

export interface Intention {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: "active" | "due_soon" | "completed" | "paused";
  targetDate?: string;
  reminderNote?: string;
  createdAt: string;
}

export interface FutureLetter {
  id: string;
  userId: string;
  title: string;
  content: string;
  unlockDate: string; // YYYY-MM-DD
  sealed: boolean;
  createdAt: string;
}

