
import { GoogleGenAI, Type } from "@google/genai";

export async function getGameRecommendations(userPrompt: string, availableGames: any[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Provide richer metadata so the AI can reason about price and platform
  const gamesSummary = availableGames.map(g => 
    `- ${g.title} | ${g.category} | ${g.platform} | $${g.price} | Released ${g.releaseYear}: ${g.description}`
  ).join('\n');

  const prompt = `
    You are the 'Nexus AI Scout', a high-tech gaming concierge from the future. 
    Your mission: Find the perfect digital experiences for the user.

    USER INPUT: "${userPrompt}"
    
    OUR LIVE INVENTORY:
    ${gamesSummary}
    
    TASK:
    1. Analyze the user's intent (genre, mood, platform, price range).
    2. Recommend 1-3 games from our inventory. 
    3. If they ask for something we don't have, find the closest thematic match.
    4. Provide a punchy, gamer-focused "Neural Logic" explanation for each choice.

    RESPONSE RULES:
    - Always return valid JSON.
    - Be witty and helpful.
    - If you can't find anything, be honest but encouraging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: "A cool, high-tech intro message." },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  gameTitle: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["gameTitle", "reason"]
              }
            }
          },
          required: ["message", "recommendations"]
        }
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      message: "Neural link interrupted. Reverting to backup protocols. Our top recommendation today is Cyber-Neon 2077!",
      recommendations: [] 
    };
  }
}
