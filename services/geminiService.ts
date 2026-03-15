
import { Project } from "../types";

export const analyzeProjectRisks = async (project: Project): Promise<string> => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });

    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    return data.text || "Analyse indisponible pour le moment.";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "Notre conseiller IA est momentanément indisponible.";
  }
};

export const chatWithAdvisor = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    return data.text || "Je n'ai pas pu traiter votre demande.";
  } catch (error) {
    console.error("Erreur Chat:", error);
    return "Désolé, une erreur est survenue.";
  }
};
