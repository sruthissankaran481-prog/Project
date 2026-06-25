import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { generateDataset, convertToCSV } from "./src/data/dataset.ts";

// Handle __dirname and __filename in ES Module environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing middleware for post requests
  app.use(express.json());

  // 1. Generate the synthetic dataset and write it physically to /social_media_engagement.csv
  const dataset = generateDataset();
  const csvContent = convertToCSV(dataset);
  const csvFilePath = path.join(process.cwd(), "social_media_engagement.csv");
  
  try {
    fs.writeFileSync(csvFilePath, csvContent, "utf8");
    console.log(`[Server] Successfully generated and wrote synthetic dataset to ${csvFilePath}`);
  } catch (err) {
    console.error("[Server] Error writing CSV dataset file:", err);
  }

  // Initialize the Gemini API client (server-side only)
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("[Server] Gemini API successfully initialized.");
  } else {
    console.warn("[Server] WARNING: GEMINI_API_KEY environment variable is not defined. Mentor Chat will be disabled.");
  }

  // --- API ROUTES ---

  // Get raw JSON dataset
  app.get("/api/dataset", (req, res) => {
    res.json({
      success: true,
      count: dataset.length,
      data: dataset
    });
  });

  // Download dataset as CSV
  app.get("/api/dataset/csv", (req, res) => {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="social_media_engagement.csv"');
    res.send(csvContent);
  });

  // AI Analytics Mentor chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, currentSandboxState } = req.body;
      
      if (!ai) {
        return res.status(503).json({ 
          error: "Gemini API client is not initialized. Please verify that your GEMINI_API_KEY is configured in the Secrets panel." 
        });
      }

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid 'messages' format in request body." });
      }

      // Format history into structure appropriate for Gemini
      // System prompt defining the Mentor personality and explaining the dataset
      const systemInstruction = `You are "Professor Taylor", a warm, encouraging, and beginner-friendly Data Analytics Mentor. 
Your goal is to help students learn data analytics using the "Social Media Engagement Analysis" project.
Keep your explanations simple, using clear real-world analogies, and strictly avoiding unexplained technical jargon.

About the Project & Dataset:
- The dataset has 300 rows representing a small business's social media posts spanning 6 months (Jan-Jun 2026).
- Columns: Post Date, Platform (Instagram, Twitter, LinkedIn), Content Type (Image, Video, Text, Carousel), Posting Time (Morning, Afternoon, Evening), Likes, Comments, Shares, Follower Count, Engagement Rate.
- Engagement Rate formula: Engagement Rate = ((Likes + Comments + Shares) / Follower Count) * 100
- Trends in the dataset:
  1. LinkedIn is the most engaging platform overall (average ~5.5%), driven heavily by Carousels (slide decks) and Morning posting times.
  2. Instagram is highly engaging (average ~4.2%), with Videos (Reels) and Carousels performing exceptionally well in the Evening. Text posts are not present or perform very poorly on Instagram.
  3. Twitter has lower engagement rates overall (average ~1.8%) due to high follower counts and low-friction posting, but gets massive Share/Retweet counts for engaging Text posts in the Afternoon.
  4. Best posting times: LinkedIn = Morning (working hours); Instagram = Evening (after work scrolling); Twitter = Afternoon (lunch/commuting).

If the user is asking about the Formula Sandbox, they currently have:
- Likes: ${currentSandboxState?.likes || 'N/A'}
- Comments: ${currentSandboxState?.comments || 'N/A'}
- Shares: ${currentSandboxState?.shares || 'N/A'}
- Followers: ${currentSandboxState?.followers || 'N/A'}
- Calculated Rate: ${currentSandboxState?.calculatedRate || 'N/A'}%

Always be supportive, guide them step-by-step, and end with a thought-provoking beginner-friendly question to keep them engaged. Avoid markdown tables where simple lists or text would be cleaner. Keep responses concise (under 250 words) to fit the chat interface nicely.`;

      // Map incoming messages to Gemini contents structure
      const contents = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I'm sorry, I couldn't generate a response. Let's try rephrasing that!";
      res.json({ reply });

    } catch (error: any) {
      console.error("[Server] Gemini Chat Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during chat generation." });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Mounting Vite dev server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Serving production static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Social Media Engagement Mentor running at http://localhost:${PORT}`);
  });
}

startServer();
