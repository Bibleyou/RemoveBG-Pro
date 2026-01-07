
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

    setStatus({ isProcessing: true, status: type === 'remove' ? 'Removendo fundo...' : 'Gerando novo cenário...', error: null });

    try {
      const gemini = new GeminiService();
      let result = '';

      if (type === 'remove') {
        result = await gemini.removeBackground(image.original, image.mimeType);
      } else if (type === 'replace' && prompt) {
        result = await gemini.replaceBackground(image.original, image.mimeType, prompt);
      }

      setImage(prev => ({ ...prev, processed: result }));
      setStatus({ isProcessing: false, status: 'Pronto!', error: null });
    } catch (err: any) {
      console.error(err);
      setStatus({ isProcessing: false, status: '', error: 'Ocorreu um erro ao processar a imagem. Verifique se o objeto está claro.' });
    }
  }, [image]);

  const downloadImage = () => {
    if (!image.processed) return;
    const link = document.createElement('a');
    link.href = image.processed;
    link.download = 'gemini-edit-result.png';
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
            Remova o Fundo com <br />
            <span className="gradient-text">Inteligência Artificial</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Utilize o poder do Gemini 2.5 para remover fundos ou criar cenários incríveis para suas fotos instantaneamente.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Area */}
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
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-1">Carregue uma imagem</h3>
                  <p className="text-slate-500 text-sm">Arraste e solte ou clique para selecionar</p>
                </div>
              ) : (
                <div className="relative flex-1">
                  <img 
                    src={image.processed || image.original} 
                    alt="Preview" 
                    className="w-full h-auto rounded-xl shadow-2xl max-h-[600px] object-contain bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]" 
                  />
                  
                  {status.isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-center p-6 transition-all">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-lg font-medium">{status.status}</p>
                      <p className="text-sm text-slate-400 mt-2">Isso pode levar alguns segundos...</p>
                    </div>
                  )}

                  {image.processed && !status.isProcessing && (
                    <button 
                      onClick={() => setImage(prev => ({ ...prev, processed: null }))}
                      className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full transition-colors backdrop-blur-md"
                      title="Restaurar Original"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {image.original && (
                <ImageActions 
                  onRemoveBg={() => processImage('remove')} 
                  onReplaceBg={(p) => processImage('replace', p)}
                  disabled={status.isProcessing}
                />
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

          {/* Sidebar Tools */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Resultado Final
              </h3>
              
              <div className="aspect-video bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden mb-6">
                {image.processed ? (
                  <img src={image.processed} alt="Final" className="max-h-full object-contain" />
                ) : (
                  <span className="text-slate-600 text-sm">Aguardando processamento...</span>
                )}
              </div>

              <button
                disabled={!image.processed || status.isProcessing}
                onClick={downloadImage}
                className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:hover:bg-green-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar Imagem HD
              </button>
            </div>

            <div className="glass rounded-3xl p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
              <h3 className="font-bold mb-2">Dica de Especialista</h3>
              <p className="text-sm text-slate-400">
                Para melhores resultados, utilize imagens com boa iluminação e onde o objeto principal esteja bem definido em relação ao fundo.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] px-2 py-1 bg-white/10 rounded-full uppercase tracking-wider font-bold">PRO</span>
                <span className="text-[10px] px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full uppercase tracking-wider font-bold">AI POWERED</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-4 px-6 glass border-t border-white/5 text-center text-xs text-slate-500 z-50">
        Desenvolvido com Gemini 2.5 API • 2024 GeminiEdit Pro
      </footer>
    </div>
  );
};

export default App;
