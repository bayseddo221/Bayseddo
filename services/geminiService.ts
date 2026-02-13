
import { GoogleGenAI } from "@google/genai";
import { Project } from "../types";

export const analyzeProjectRisks = async (project: Project): Promise<string> => {
  try {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest config
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      contents: prompt,
    });

    return response.text || "Analyse indisponible pour le moment.";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "Notre conseiller IA est momentanément indisponible.";
  }
};

export const chatWithAdvisor = async (userMessage: string): Promise<string> => {
  try {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: "Tu es 'Bay Seddo AI', un assistant expert agricole au Sénégal. Tu parles couramment Français et Wolof. Tes réponses doivent être chaleureuses et utiliser des expressions sénégalaises (ex: 'Nanga def', 'Jërëjëf', 'Bay Seddo dina la jappalé'). Si l'utilisateur parle Wolof, réponds en Wolof. Aide les utilisateurs à investir dans l'agriculture locale. Sois concis et poli."
      }
    });
    return response.text || "Je n'ai pas pu traiter votre demande.";
  } catch (error) {
    console.error("Erreur Chat:", error);
    return "Désolé, une erreur est survenue.";
  }
};
