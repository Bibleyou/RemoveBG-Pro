
export class GeminiService {
  private apiKey: string;

  constructor() {
    // Usamos o mesmo nome de variável de ambiente para facilitar na Vercel
    this.apiKey = process.env.API_KEY || '';
    
    if (!this.apiKey) {
      console.error("API_KEY do remove.bg não encontrada.");
    }
  }

  async removeBackground(base64Image: string, _mimeType: string): Promise<string> {
    try {
      // O remove.bg espera o base64 puro ou um arquivo.
      const base64Data = base64Image.split(',')[1];
      
      const formData = new FormData();
      formData.append('image_base64', base64Data);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.title || "Erro ao remover fundo");
      }

      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error: any) {
      console.error("Erro na API remove.bg:", error);
      throw new Error(error.message || "Falha na conexão com remove.bg");
    }
  }

  // O remove.bg não possui substituição por prompt de texto como o Gemini, 
  // então vamos desativar ou simplificar esta função para não quebrar o App.tsx
  async replaceBackground(base64Image: string, mimeType: string, _prompt: string): Promise<string> {
    return this.removeBackground(base64Image, mimeType);
  }
}
