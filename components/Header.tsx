
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 mb-8 border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Gemini<span className="text-blue-500">Edit</span></span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Remover Fundo</a>
          <a href="#" className="hover:text-white transition-colors">Substituir IA</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
