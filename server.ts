import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initializer for Gemini client to prevent crashes if key is delayed
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not configured. Please add your GEMINI_API_KEY in Settings > Secrets."
    );
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Resilient wrapper with retry and model fallback for transient high demand (e.g. 503)
async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        const isTransient =
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("429") ||
          msg.includes("ResourceExhausted");

        if (!isTransient) {
          throw err;
        }
        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

function extractErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred.";
  const msg = error.message || String(error);
  try {
    const parsed = JSON.parse(msg);
    if (parsed?.error?.message) return parsed.error.message;
  } catch {}
  return msg;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Multi-turn Gemini conversation endpoint for reflective journaling
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, userPrompt, entryContext } = req.body;

    if (!userPrompt || typeof userPrompt !== "string") {
      res.status(400).json({ error: "userPrompt string is required" });
      return;
    }

    const ai = getGemini();

    // Prepare system instructions tailored for deep, thoughtful, mindful journaling
    let systemInstruction =
      "You are the empathetic, thoughtful, and insightful AI journaling companion inside 'Personal Gemini Journal'. " +
      "Your purpose is to help the user reflect honestly, process their thoughts, discover clarity, and notice meaningful patterns in their experiences and emotions. " +
      "Guidelines:\n" +
      "- Maintain a warm, encouraging, non-judgmental, and grounded tone.\n" +
      "- Validate feelings without excessive flattery or robotic clichés.\n" +
      "- Ask 1-2 open-ended, gentle reflection questions that guide deeper introspection.\n" +
      "- Do not give prescriptive medical or psychological advice; act as a supportive sounding board and personal journal partner.\n" +
      "- Format responses with clean, readable paragraphs or subtle bullet points if outlining insights.";

    if (entryContext?.title || entryContext?.mood) {
      systemInstruction += `\nCurrent Journal Context: Title: "${entryContext.title || "Untitled"}", Emotional Mood: "${entryContext.mood || "Unspecified"}".`;
    }

    // Build contents array for multi-turn history
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages)) {
      for (const msg of messages) {
        if (msg.role === "user" || msg.role === "model") {
          contents.push({
            role: msg.role,
            parts: [{ text: String(msg.content || "") }],
          });
        }
      }
    }

    // Add current user prompt
    contents.push({
      role: "user",
      parts: [{ text: userPrompt }],
    });

    const response = await generateWithFallback(ai, {
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "I'm reflecting on your thoughts. Please feel free to continue sharing.";
    res.json({ text });
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    res.status(500).json({
      error: extractErrorMessage(error) || "Failed to generate reflection from Gemini.",
    });
  }
});

// Journal synthesis and summary endpoint
app.post("/api/gemini/summarize", async (req, res) => {
  try {
    const { title, content, messages } = req.body;

    if (!title && !content && (!messages || messages.length === 0)) {
      res.status(400).json({ error: "At least one journal field or conversation message is required." });
      return;
    }

    const ai = getGemini();

    const transcript = [
      title ? `Title: ${title}` : "",
      content ? `Journal Notes:\n${content}` : "",
      Array.isArray(messages) && messages.length > 0
        ? `Conversation History:\n` +
          messages.map((m: any) => `${m.role === "user" ? "User" : "Gemini"}: ${m.content}`).join("\n")
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const prompt =
      `Please synthesize this personal journal entry and conversation into a coherent, private reflection summary:\n\n` +
      `${transcript}\n\n` +
      `Provide a structured JSON output with a comprehensive reflective summary, emotional tone, 3-5 core themes, and 2-4 mindful action items/inquiries for personal growth.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A thoughtful, comprehensive summary synthesizing the user's feelings, discoveries, and narrative.",
            },
            emotionalTone: {
              type: Type.STRING,
              description: "The primary emotional tone (e.g., Grateful, Reflective, Hopeful, Processing Stress, Ambivalent, Energized).",
            },
            keyThemes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key recurrent concepts or themes identified in the entry.",
            },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable mindfulness steps, self-care practices, or journaling inquiries to carry forward.",
            },
          },
          required: ["summary", "emotionalTone", "keyThemes", "actionItems"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/summarize:", error);
    res.status(500).json({
      error: extractErrorMessage(error) || "Failed to generate journal summary.",
    });
  }
});

// Prompt generator for inspiration
app.post("/api/gemini/prompts", async (req, res) => {
  try {
    const { mood, topic } = req.body;
    const ai = getGemini();

    const prompt =
      `Generate 3 deep, mindful, and engaging journal writing prompts` +
      (mood ? ` tailored for someone feeling ${mood}` : "") +
      (topic ? ` exploring the theme of ${topic}` : "") +
      `. Return JSON with an array of string prompts.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 inspiring and thoughtful journal prompts",
            },
          },
          required: ["prompts"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/prompts:", error);
    res.status(500).json({
      error: extractErrorMessage(error) || "Failed to generate prompts.",
    });
  }
});

// Grounded contextual reflection note for a specific diary page
app.post("/api/gemini/reflect-entry", async (req, res) => {
  try {
    const { title, content, mood, tags, photoCaptions } = req.body;
    if (!content && !title) {
      res.status(400).json({ error: "Title or content is required to reflect." });
      return;
    }

    const ai = getGemini();
    const prompt =
      `You are the gentle, observant Gemini AI living inside this user's personal digital physical diary.\n` +
      `Read this private diary page and provide a deeply empathetic, grounded, and personal reflection note.\n` +
      `Focus on what they felt, unexpressed courage, subtle contradictions, or moments of grace.\n` +
      `Never shame the user. Never sound like a corporate performance coach. Speak like an insightful, warm lifelong confidant.\n\n` +
      `Entry Details:\n` +
      `- Title: ${title || "Untitled"}\n` +
      `- Mood: ${mood || "Unspecified"}\n` +
      `- Tags: ${(tags || []).join(", ") || "None"}\n` +
      `- Journal Text:\n${content || "(No written text)"}\n` +
      (photoCaptions && photoCaptions.length > 0
        ? `- Photo Narrations / Captions:\n${photoCaptions.join("\n")}\n`
        : "") +
      `\nReturn JSON with:\n` +
      `- reflection: 2-3 warm, observant paragraphs reflecting back the deeper truth of their entry\n` +
      `- emotionalTone: A descriptive 1-2 word mood descriptor\n` +
      `- coreInsight: A one-sentence takeaway or thought to hold\n` +
      `- mindfulPrompt: One tender inquiry to ask themselves as they turn the page`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reflection: { type: Type.STRING },
            emotionalTone: { type: Type.STRING },
            coreInsight: { type: Type.STRING },
            mindfulPrompt: { type: Type.STRING },
          },
          required: ["reflection", "emotionalTone", "coreInsight", "mindfulPrompt"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/reflect-entry:", error);
    res.status(500).json({
      error: extractErrorMessage(error) || "Failed to generate page reflection.",
    });
  }
});

// "Gemini noticed..." intention and goal detection endpoint
app.post("/api/gemini/notice", async (req, res) => {
  try {
    const { content, title } = req.body;
    if (!content || content.length < 20) {
      res.json({ noticed: false });
      return;
    }

    const ai = getGemini();
    const prompt =
      `Analyze this diary entry to see if the author expressed a genuine intention, goal, dream, or habit they wish to build.\n` +
      `Entry Title: "${title || "Untitled"}"\n` +
      `Text:\n"${content}"\n\n` +
      `If an intention or goal is present (e.g. "I want to start learning machine learning", "I need to call mom more", "I want to finish chapter 3"), identify it gently.\n` +
      `If no goal/intention is present, return noticed = false.\n` +
      `Always be supportive, warm, and non-judgmental.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            noticed: { type: Type.BOOLEAN },
            quote: { type: Type.STRING, description: "Direct quote or phrase from the entry" },
            suggestion: { type: Type.STRING, description: "Gentle reminder question, e.g., 'You mentioned wanting to start... Still something you want to work toward?'" },
            suggestedTitle: { type: Type.STRING, description: "Short title for the intention, e.g., 'Learn machine learning'" },
            suggestedDescription: { type: Type.STRING, description: "Brief description" },
          },
          required: ["noticed"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{"noticed":false}');
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/gemini/notice:", error);
    res.json({ noticed: false });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Personal Gemini Journal server running on port ${PORT}`);
  });
}

startServer();
