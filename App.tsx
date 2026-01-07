
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import { RemoveBGService } from './services/removeBgService';
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

  const processImage = useCallback(async () => {
    if (!image.original) return;

    setStatus({ isProcessing: true, status: 'Processando imagem...', error: null });

    try {
      const api = new RemoveBGService();
      const result = await api.removeBackground(image.original);

      setImage(prev => ({ ...prev, processed: result }));
      setStatus({ isProcessing: false, status: 'Pronto!', error: null });
    } catch (err: any) {
      console.error(err);
      setStatus({ 
        isProcessing: false, 
        status: '', 
        error: err.message
      });
    }
  }, [image]);

  const downloadImage = () => {
    if (!image.processed) return;
    const link = document.createElement('a');
    link.href = image.processed;
    link.download = 'removido-removebg.png';
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
            Remover Fundo <br />
            <span className="text-indigo-500 font-black">PROFISSIONAL</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Qualidade industrial usando sua API Key do <strong>remove.bg</strong>.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="glass rounded-3xl p-6 min-h-[450px] flex flex-col">
              {!image.original ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl drop-zone cursor-pointer relative py-20">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Enviar Imagem</h3>
                  <p className="text-slate-500 text-base">Clique aqui ou arraste o arquivo</p>
                </div>
              ) : (
                <div className="relative flex-1 flex flex-col">
                  <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-repeat rounded-xl overflow-hidden shadow-inner border border-white/5 bg-slate-800/50">
                    <img 
                      src={image.processed || image.original} 
                      alt="Preview" 
                      className="absolute inset-0 w-full h-full object-contain" 
                    />
                    
                    {status.isProcessing && (
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-10">
                        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xl font-bold text-white animate-pulse">{status.status}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => setImage({ original: null, processed: null, mimeType: '' })}
                      className="px-6 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all"
                    >
                      Trocar Foto
                    </button>
                    {!image.processed && (
                      <button
                        onClick={processImage}
                        disabled={status.isProcessing}
                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                      >
                        REMOVER FUNDO AGORA
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="glass rounded-3xl p-6 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                Ações
              </h3>

              <div className="flex-1 space-y-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wider">Status</p>
                  <div className="flex items-center gap-2 text-green-400 font-bold">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    API Pronta
                  </div>
                </div>

                <button
                  disabled={!image.processed || status.isProcessing}
                  onClick={downloadImage}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-900/20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4-4v12" />
                  </svg>
                  BAIXAR PNG
                </button>

                {status.error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm leading-relaxed">
                    <strong>Atenção:</strong> {status.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
