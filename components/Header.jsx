
import React from 'react';
// Cabeçalho simples sem modais desnecessários
const Header = ({ onLogout, currentUser }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#1D63BD] to-cyan-500 flex items-center justify-center text-white font-black">AC</div>
          <div className="font-black uppercase">AutoCheck</div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right"><p className="text-xs font-bold text-slate-800 uppercase">{currentUser || 'Mecânico'}</p><p className="text-[10px] text-slate-400">Admin</p></div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1D63BD] to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 uppercase">{currentUser?.substring(0, 2) || 'OK'}</div>
          <button onClick={onLogout} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-100" title="Sair"><i className="fas fa-sign-out-alt"></i></button>
        </div>
      </div>
    </header>
  );
};

export default Header;
