
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageActions from './components/ImageActions';
import { GeminiService } from './services/geminiService';
import { ProcessingState, ImageData } from './types';

const App: React.FC = () => {
  const [image, setImage] = useState<ImageData>({
    original: null,
    processed: null,
    mimeType: '',
  });

  const [status, setStatus] = useState<ProcessingState>({
    isProcessing: false,
    status: '',
    error: null,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage({
        original: event.target?.result as string,
        processed: null,
        mimeType: file.type,
      });
      setStatus({ isProcessing: false, status: '', error: null });
    };
    reader.readAsDataURL(file);
  };

  const processImage = useCallback(async (type: 'remove' | 'replace', prompt?: string) => {
    if (!image.original) return;

    setStatus({ isProcessing: true, status: 'Removendo fundo com precisão...', error: null });

    try {
      const api = new GeminiService();
      let result = '';

      if (type === 'remove') {
        result = await api.removeBackground(image.original, image.mimeType);
      } else if (type === 'replace') {
        // Como o remove.bg é focado em remoção, avisamos que a substituição IA é limitada nesta versão
        result = await api.removeBackground(image.original, image.mimeType);
      }

      setImage(prev => ({ ...prev, processed: result }));
      setStatus({ isProcessing: false, status: 'Fundo removido!', error: null });
    } catch (err: any) {
      console.error(err);
      setStatus({ 
        isProcessing: false, 
        status: '', 
        error: err.message.includes("403") 
          ? "Sua chave de API do remove.bg parece inválida ou sem créditos." 
          : "Erro ao processar. Verifique sua chave de API nas configurações da Vercel." 
      });
    }
  }, [image]);

  const downloadImage = () => {
    if (!image.processed) return;
    const link = document.createElement('a');
    link.href = image.processed;
    link.download = 'sem-fundo-removebg.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Remoção Profissional <br />
            <span className="text-indigo-500">em Segundos</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Utilizando a sua chave oficial do <strong>remove.bg</strong> para resultados com qualidade de estúdio.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <div className="glass rounded-3xl p-6 relative overflow-hidden min-h-[400px] flex flex-col">
              {!image.original ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl drop-zone cursor-pointer relative py-20 px-4">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-1">Escolha sua foto</h3>
                  <p className="text-slate-500 text-sm">Arraste aqui ou clique para buscar</p>
                </div>
              ) : (
                <div className="relative flex-1">
                  <img 
                    src={image.processed || image.original} 
                    alt="Preview" 
                    className="w-full h-auto rounded-xl shadow-2xl max-h-[600px] object-contain bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-repeat" 
                  />
                  
                  {status.isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-center p-6 transition-all">
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-lg font-medium">{status.status}</p>
                    </div>
                  )}
                </div>
              )}

              {image.original && (
                <div className="mt-6">
                   <button
                    onClick={() => processImage('remove')}
                    disabled={status.isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                  >
                    Remover Fundo Agora
                  </button>
                </div>
              )}
            </div>
            
            {status.error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{status.error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Resultado
              </h3>
              
              <div className="aspect-video bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden mb-6 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')]">
                {image.processed ? (
                  <img src={image.processed} alt="Final" className="max-h-full object-contain" />
                ) : (
                  <span className="text-slate-600 text-sm italic">Aguardando...</span>
                )}
              </div>

              <button
                disabled={!image.processed || status.isProcessing}
                onClick={downloadImage}
                className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-30 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                Baixar Transparente (PNG)
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-4 px-6 glass border-t border-white/5 text-center text-xs text-slate-500 z-50">
        Powered by Remove.bg API • Conectado com sua chave de API
      </footer>
    </div>
  );
};

export default App;
