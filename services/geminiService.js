
import { GoogleGenAI } from "@google/genai";

// Parte da IA (Gemini)
export const generateAISummary = async (data) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Como um consultor técnico de oficina, gere um resumo amigável para o cliente 
    com base nesta inspeção:
    Veículo: ${data.vehicle.brandModel}
    Pneus: ${data.tires.grooves}
    Observações: ${data.observations}
    Peças: ${data.partsUsed}
    
    Seja profissional, tecnológico e destaque que o carro está pronto para rodar com segurança.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar resumo AI", error);
    return "Não foi possível gerar o resumo automático.";
  }
};
