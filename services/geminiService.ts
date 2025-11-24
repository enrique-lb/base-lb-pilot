import { GoogleGenAI, Type } from "@google/genai";
import { IssueAnalysis } from "../types";

// Helper to validate if environment variable is set safely
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export const analyzeIssueWithGemini = async (issueContent: string): Promise<IssueAnalysis | null> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key missing");
    return {
        title: "Manual Issue Entry",
        summary: "API Key missing. Simulating analysis...",
        suggestedPrice: 100,
        difficulty: "Medium",
        tags: ["Unknown"]
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert software project manager for a crypto bounty platform. Analyze the following GitHub issue description.
      
      Task:
      1. Create a short, catchy title for the bounty.
      2. Summarize the task in one sentence.
      3. Suggest a fair bounty price in USDC (integers only) based on complexity (Generous rates: Easy=$50-200, Medium=$200-500, Hard=$500-1500, Expert=$1500+).
      4. Rate difficulty: Easy, Medium, Hard, or Expert.
      5. Suggest 3 relevant technical tags.

      Issue Description:
      "${issueContent}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            suggestedPrice: { type: Type.INTEGER },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard", "Expert"] },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["title", "summary", "suggestedPrice", "difficulty", "tags"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as IssueAnalysis;
    }
    
    throw new Error("No response text");

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback mock response if API fails
    return {
      title: "New Bounty",
      summary: "Could not analyze automatically. Please set details manually.",
      suggestedPrice: 50,
      difficulty: "Medium",
      tags: ["Manual"]
    };
  }
};
