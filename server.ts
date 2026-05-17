import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/commentary", async (req, res) => {
    const { speed, event, damage, bikeType } = req.body;
    
    try {
      const prompt = `You are a hype-man race commentator for a futuristic cyber-racing game called Velocity Riders.
      The player is riding a ${bikeType}. 
      Current stats: Speed: ${speed}km/h, Damage: ${damage}%, Event: ${event}.
      Generate a very short (max 10 words), energetic, cinematic one-liner commentary about this. 
      Use cyberpunk slang if appropriate.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ text: response.text || "Push it to the limit!" });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.json({ text: "GO GO GO!" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
