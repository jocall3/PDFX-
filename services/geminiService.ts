
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are an AI assistant for a document editor. Your task is to expand upon the user's text. Be creative and helpful. Generate content in markdown format.",
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in generateContent:", error);
    throw new Error("Failed to generate content from Gemini API.");
  }
};


export const debugScriptWithAI = async (script: string, error: string): Promise<string> => {
  const prompt = `
    You are an expert JavaScript debugger. A user's script has failed.
    Analyze the provided JavaScript code and the error message, then provide a corrected version of the script.
    Explain the error and the fix clearly and concisely.
    Format your response in markdown.

    --- SCRIPT ---
    ${script}
    --- END SCRIPT ---

    --- ERROR MESSAGE ---
    ${error}
    --- END ERROR MESSAGE ---
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error in debugScriptWithAI:", error);
    throw new Error("Failed to debug script with Gemini API.");
  }
};
