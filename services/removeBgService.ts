
export class RemoveBGService {
  private apiKey: string;

  constructor() {
    // Pegamos a chave e removemos qualquer espaço em branco acidental no início ou fim
    this.apiKey = (process.env.API_KEY || '').trim();
  }

  async removeBackground(base64Image: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("CONFIG_MISSING");
    }

    try {
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

      if (response.status === 403 || response.status === 401) {
        throw new Error("API_KEY_INVALID");
      }

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.errors?.[0]?.title || "Erro desconhecido";
        throw new Error(msg);
      }

      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error: any) {
      console.error("Erro na API remove.bg:", error.message);
      throw error;
    }
  }
}
