
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Em ambientes de build como Vercel, process.env.API_KEY é injetado.
    // Garantimos que a inicialização siga o padrão exigido.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("API_KEY não encontrada. Configure-a nas variáveis de ambiente da Vercel.");
    }

    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async removeBackground(base64Image: string, mimeType: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1],
                mimeType: mimeType,
              },
            },
            {
              text: "Remova o fundo desta imagem. Retorne apenas a imagem processada mantendo a maior qualidade possível.",
            },
          ],
        },
      });

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("Nenhuma imagem retornada pela IA.");
    } catch (error: any) {
      if (error.message?.includes("API key not valid")) {
        throw new Error("Erro de Configuração: Chave de API inválida na Vercel.");
      }
      throw error;
    }
  }

  async replaceBackground(base64Image: string, mimeType: string, prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: `Substitua o fundo desta imagem por: ${prompt}. Mantenha o foco e iluminação do objeto original.`,
          },
        ],
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Falha ao gerar novo fundo.");
  }
}
