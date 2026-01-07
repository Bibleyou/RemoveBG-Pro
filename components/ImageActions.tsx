
import React, { useState } from 'react';

interface ImageActionsProps {
  onRemoveBg: () => void;
  onReplaceBg: (prompt: string) => void;
  disabled: boolean;
}

const ImageActions: React.FC<ImageActionsProps> = ({ onRemoveBg, onReplaceBg, disabled }) => {
  const [prompt, setPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onRemoveBg}
          disabled={disabled}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-900 rounded-2xl font-semibold hover:bg-slate-100 transition-all disabled:opacity-50 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remover Fundo
        </button>

        <button
          onClick={() => setShowPromptInput(!showPromptInput)}
          disabled={disabled}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Substituir com IA
        </button>
      </div>

      {showPromptInput && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Praia ao pôr do sol, escritório moderno..."
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-500"
            />
            <button
              onClick={() => onReplaceBg(prompt)}
              disabled={disabled || !prompt.trim()}
              className="px-6 py-3 bg-blue-600 rounded-xl font-medium hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              Gerar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageActions;
