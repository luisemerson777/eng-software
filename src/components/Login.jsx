import React, { useState } from 'react';

// Tela de login que consome a API em /api/login
const Login = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!onLogin) return;
    onLogin({ username: user, password }, (u) => {}, (err) => setError(err || 'Falha ao autenticar'));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[1.25rem] p-8 shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1D63BD] to-cyan-500 flex items-center justify-center text-white text-2xl font-black mb-3">AC</div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">AutoCheck</h2>
          <p className="text-slate-400 font-medium">Sistema de inspeção</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Usuário</label>
            <input required className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" placeholder="luis" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Senha</label>
            <input required type="password" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-500 text-sm font-bold">{error}</div>}
          <button type="submit" className="w-full py-3 bg-[#1D63BD] text-white font-bold rounded-2xl">Acessar</button>
          <div className="mt-6 text-center text-xs text-slate-400">AutoCheck © 2024</div>
        </form>
      </div>
    </div>
  );
};

export default Login;
