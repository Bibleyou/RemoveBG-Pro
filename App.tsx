
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

    if (!file.type.startsWith('image/')) {
      setStatus({ isProcessing: false, status: '', error: 'Por favor, envie apenas imagens.' });
      return;
    }

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

    setStatus({ isProcessing: true, status: 'Removendo o fundo...', error: null });

    try {
      const api = new RemoveBGService();
      const result = await api.removeBackground(image.original);

      setImage(prev => ({ ...prev, processed: result }));
      setStatus({ isProcessing: false, status: 'Pronto!', error: null });
    } catch (err: any) {
      let friendlyError = err.message;
      
      if (friendlyError === "API_KEY_INVALID") {
        friendlyError = "Chave de API Inválida.";
      } else if (friendlyError === "CONFIG_MISSING") {
        friendlyError = "A variável 'API_KEY' não foi encontrada no ambiente.";
      }

      setStatus({ 
        isProcessing: false, 
        status: '', 
        error: friendlyError
      });
    }
  }, [image]);

  const downloadImage = () => {
    if (!image.processed) return;
    const link = document.createElement('a');
    link.href = image.processed;
    link.download = `sem-fundo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 rounded-full border border-indigo-500/20">
            Status: Professional Engine Ativo
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
            Remoção de Fundo <br/>
            <span className="text-indigo-500">Alta Performance</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] p-8 min-h-[500px] flex flex-col border border-white/5 shadow-2xl">
              {!image.original ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] hover:border-indigo-500/40 transition-all cursor-pointer group relative overflow-hidden">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                  <div className="p-8 bg-indigo-600/10 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Selecione uma Imagem</h3>
                  <p className="text-slate-500 font-medium">PNG, JPG ou WEBP</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-inner min-h-[350px]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] opacity-10"></div>
                    <img 
                      src={image.processed || image.original} 
                      alt="Preview" 
                      className="absolute inset-0 w-full h-full object-contain p-4 z-1" 
                    />
                    {status.isProcessing && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-xl font-bold text-white uppercase tracking-[0.2em] animate-pulse">{status.status}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => setImage({ original: null, processed: null, mimeType: '' })}
                      className="px-8 py-5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-white/5 active:scale-95"
                    >
                      Trocar Imagem
                    </button>
                    {!image.processed && (
                      <button
                        onClick={processImage}
                        disabled={status.isProcessing}
                        className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 text-lg"
                      >
                        REMOVER FUNDO
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Bloco de Exportação / Erro */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Resultado
              </h3>

              <div className="space-y-4">
                <button
                  disabled={!image.processed || status.isProcessing}
                  onClick={downloadImage}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black text-xl rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4-4v12" />
                  </svg>
                  BAIXAR PNG
                </button>

                {status.error && (
                  <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      Erro Detectado
                    </div>
                    <p className="text-sm font-bold leading-tight">{status.error}</p>
                    
                    <div className="text-[11px] text-slate-400 space-y-2 bg-black/20 p-4 rounded-xl border border-white/5">
                      <p className="font-bold text-white">Guia Rápido de Correção:</p>
                      <ul className="list-disc ml-4 space-y-1">
                        <li><strong>Label (Nome):</strong> Não importa se está "REMOVEBG".</li>
                        <li><strong>API Key:</strong> Copie o código cinza abaixo de "API Key:" no site.</li>
                        <li><strong>Vercel:</strong> Se você acabou de salvar a chave, vá em <strong>Deployments</strong> na Vercel e clique em <strong>Redeploy</strong>.</li>
                      </ul>
                    </div>
                    
                    <a 
                      href="https://www.remove.bg/dashboard#api-key" 
                      target="_blank" 
                      className="block w-full py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-center rounded-xl text-xs font-bold text-indigo-300 transition-all border border-indigo-500/20 uppercase"
                    >
                      Abrir Dashboard do Remove.bg
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Dica Adicional */}
            <div className="bg-indigo-500/5 rounded-[2.5rem] p-8 border border-indigo-500/10">
               <h4 className="text-lg font-bold text-indigo-400 mb-4 tracking-tight">Dica de Especialista</h4>
               <p className="text-sm text-slate-500 leading-relaxed">
                 O <strong>Label</strong> é apenas um nome interno. O que o sistema usa para autenticar é a <strong>API Key</strong>. Verifique se não há espaços no início ou fim ao colar na Vercel.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
