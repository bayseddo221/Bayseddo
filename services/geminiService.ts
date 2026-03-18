
import { Project } from "../types";

export const analyzeProjectRisks = async (project: Project): Promise<string> => {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "API request failed");
    }
    const data = await response.json();
    return data.text || "Analyse indisponible pour le moment.";
  } catch (error: any) {
    console.error("Erreur Gemini:", error);
    return `Erreur: ${error.message || "Notre conseiller IA est momentanément indisponible."}`;
  }
};

export const chatWithAdvisor = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "API request failed");
    }
    const data = await response.json();
    return data.text || "Je n'ai pas pu traiter votre demande.";
  } catch (error: any) {
    console.error("Erreur Chat:", error);
    return `Erreur: ${error.message || "Désolé, une erreur est survenue."}`;
  }
};
