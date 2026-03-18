
import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ override: true });

const app = express();
app.use(express.json());

// Gemini API setup
const getAI = () => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key) {
    console.error("No API key found in environment variables (GEMINI_API_KEY or API_KEY)");
    throw new Error("Gemini API key is not defined");
  }
  
  const maskedKey = key.substring(0, 6) + "..." + key.substring(key.length - 4);
  console.log(`Using API Key: ${maskedKey} (Length: ${key.length})`);
  
  return new GoogleGenAI({ apiKey: key });
};

// API Routes
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "Tu es 'Bay Seddo AI', un assistant expert agricole au Sénégal. Tu parles couramment Français et Wolof. Tes réponses doivent être chaleureuses et utiliser des expressions sénégalaises (ex: 'Nanga def', 'Jërëjëf', 'Bay Seddo dina la jappalé'). Si l'utilisateur parle Wolof, réponds en Wolof. Aide les utilisateurs à investir dans l'agriculture locale. Sois concis et poli."
      }
    });
    
    const text = response.text || "Je n'ai pas pu générer de réponse.";
    res.json({ text });
  } catch (error: any) {
    console.error("Chat API Error Details:", error);
    const errorMessage = error.message || "Failed to process chat";
    res.status(500).json({ error: errorMessage });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { project } = req.body;
    if (!project) {
      return res.status(400).json({ error: "Project data is required" });
    }
    
    const ai = getAI();
    const prompt = `
      Agis comme un expert agronome sénégalais expert en risque financier.
      Analyse brièvement ce projet pour un investisseur potentiel :
      
      Titre: ${project.title}
      Type: ${project.category}
      Lieu: ${project.location}
      Budget cible: ${project.targetAmount} FCFA
      ROI estimé: ${project.roi}%
      Durée: ${project.duration} mois
      Description: ${project.description}

      Donne une réponse courte (max 3 phrases) sur la viabilité et un conseil clé.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    const text = response.text || "Analyse indisponible.";
    res.json({ text });
  } catch (error: any) {
    console.error("Analyze API Error Details:", error);
    const errorMessage = error.message || "Failed to analyze project";
    res.status(500).json({ error: errorMessage });
  }
});

export default app;
