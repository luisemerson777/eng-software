import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_FORM_STATE } from './constants';
import InspectionForm from './components/InspectionForm';
import HistoryView from './components/HistoryView';
import Login from './components/Login';

// Componente principal da aplicação
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' ? window.localStorage.getItem('theme') === 'dark' : false));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('carros');
  const [isAuthenticated, setIsAuthenticated] = useState(() => (typeof window !== 'undefined' ? window.localStorage.getItem('autocheck_auth') === 'true' : false));
  const [currentUser, setCurrentUser] = useState(() => (typeof window !== 'undefined' ? window.localStorage.getItem('autocheck_user') : null));
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [history, setHistory] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [customSections, setCustomSections] = useState({ carros: [] });
  const [savedVehicles, setSavedVehicles] = useState([]);

  // Aplica tema ao documento
  useEffect(() => {
    document.documentElement.classList[isDarkMode ? 'add' : 'remove']('dark');
    if (typeof window !== 'undefined') window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Carrega histórico da API
  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const res = await fetch('/api/inspections');
        if (res.ok) {
          const json = await res.json();
          setHistory(json.inspections || []);
        }
      } catch (e) { console.error('Erro ao buscar histórico', e); }
    };
    load();
  }, [isAuthenticated]);

  // Salvar inspeção via API
  const handleSaveToHistory = useCallback(async (data) => {
    try {
      const res = await fetch('/api/inspections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) {
        const json = await res.json();
        setHistory(p => [json.inspection, ...p.filter(i => i.id !== json.inspection.id)]);
        if (data.vehicle?.brandModel) setSavedVehicles(p => Array.from(new Set([...(p || []), data.vehicle.brandModel])));
        setActiveTab('history');
        setFormData(INITIAL_FORM_STATE);
      }
    } catch (e) { console.error('Erro ao salvar inspeção', e); }
  }, []);

  // Deletar inspeção via API
  const handleDeleteInspection = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/inspections/${id}`, { method: 'DELETE' });
      if (res.ok) setHistory(p => p.filter(i => i.id !== id));
    } catch (e) { console.error('Erro ao deletar', e); }
  }, []);

  const handleAddSection = useCallback((cat, title) => setCustomSections(p => ({ ...p, [cat]: [...(p[cat]||[]), { id: Date.now(), title, fields: [] }] })), []);
  const handleRemoveSection = useCallback((cat, sId) => setCustomSections(p => ({ ...p, [cat]: (p[cat]||[]).filter(s => String(s.id) !== String(sId)) })), []);
  const handleAddField = useCallback((cat, sId, label) => setCustomSections(p => ({ ...p, [cat]: (p[cat]||[]).map(s => s.id === sId ? { ...s, fields: [...s.fields, { id: Date.now(), label }] } : s) })), []);
  const handleRemoveField = useCallback((cat, sId, fId) => setCustomSections(p => ({ ...p, [cat]: (p[cat]||[]).map(s => String(s.id) === String(sId) ? { ...s, fields: s.fields.filter(f => String(f.id) !== String(fId)) } : s) })), []);

  const handleDeleteVehicle = useCallback((v) => setSavedVehicles(p => p.filter(x => x !== v)), []);

  // Autenticação via API
  const handleLogin = useCallback(async ({ username, password }, onSuccess, onError) => {
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      if (res.ok) {
        const json = await res.json();
        setIsAuthenticated(true); setCurrentUser(json.user);
        if (typeof window !== 'undefined') { window.localStorage.setItem('autocheck_auth', 'true'); window.localStorage.setItem('autocheck_user', json.user); }
        if (onSuccess) onSuccess(json.user);
      } else {
        const err = await res.json().catch(() => ({}));
        if (onError) onError(err.message || 'Erro ao autenticar');
      }
    } catch (e) { if (onError) onError('Erro de conexão'); }
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false); setCurrentUser(null);
    if (typeof window !== 'undefined') { window.localStorage.removeItem('autocheck_auth'); window.localStorage.removeItem('autocheck_user'); }
  }, []);

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;
  const isDesktop = windowWidth >= 1024;
  const menuItems = [{ id: 'carros', label: 'Carros', icon: 'fa-car' }, { id: 'history', label: 'Histórico', icon: 'fa-calendar-check' }];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && !isDesktop && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[100] transition-all duration-300 transform 
        ${!isDesktop ? (isSidebarOpen ? 'w-72 translate-x-0 shadow-2xl' : 'w-72 -translate-x-full') : (isSidebarOpen ? 'w-72' : 'w-20')}`}>
        
        <div className="flex flex-col h-full">
          <div className="p-4 h-20 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
            {(isSidebarOpen || !isDesktop) ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#1D63BD] to-cyan-500 flex items-center justify-center text-white font-black">AC</div>
                <div className="font-black uppercase">AutoCheck</div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <i className="fas fa-check-circle text-[#1D63BD] text-3xl"></i>
              </div>
            )}
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-400">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if(!isDesktop) setIsSidebarOpen(false); }}
                className={`w-full flex items-center ${isSidebarOpen || !isDesktop ? 'space-x-4 p-4' : 'justify-center p-3'} rounded-2xl transition-all group ${activeTab === item.id ? 'bg-[#1D63BD] text-white shadow-xl shadow-blue-100 dark:shadow-none' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'}`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                {(isSidebarOpen || !isDesktop) && <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
              </button>
            ))}
          </nav>
          
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-full flex items-center ${isSidebarOpen || !isDesktop ? 'space-x-4 p-4' : 'justify-center p-3'} text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all`}
            >
              <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-lg">
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </div>
              {(isSidebarOpen || !isDesktop) && <span className="font-bold">Tema</span>}
            </button>
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center ${isSidebarOpen || !isDesktop ? 'space-x-4 p-4' : 'justify-center p-3'} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all`}
            >
              <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-900/10 text-lg">
                <i className="fas fa-sign-out-alt"></i>
              </div>
              {(isSidebarOpen || !isDesktop) && <span className="font-bold">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 min-h-screen ${isDesktop ? (isSidebarOpen ? 'pl-72' : 'pl-20') : 'pl-0'}`}>
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-[60] flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              <i className="fas fa-bars text-slate-600 dark:text-white text-xl"></i>
            </button>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-[#1D63BD] uppercase tracking-wider leading-none mb-1">AutoCheck Pro</h2>
              <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                {menuItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <div className="text-right hidden sm:block">
               <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Logado como</p>
               <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">{currentUser}</p>
             </div>
             <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1D63BD] to-cyan-500 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100 dark:shadow-none">
               {currentUser?.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6 sm:p-10">
          {activeTab === 'carros' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><InspectionForm initialData={formData} onSubmit={handleSaveToHistory} customSections={customSections.carros} onAddSection={(t) => handleAddSection('carros', t)} onRemoveSection={(i) => handleRemoveSection('carros', i)} onAddFieldToSection={(s, l) => handleAddField('carros', s, l)} onRemoveFieldFromSection={(s, f) => handleRemoveField('carros', s, f)} savedVehicles={savedVehicles} onDeleteVehicle={handleDeleteVehicle} /></div>}
          {activeTab === 'history' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><HistoryView history={history} onDelete={(i) => window.confirm('Excluir?') && handleDeleteInspection(i)} onViewReport={(d) => { setFormData(d); setActiveTab('carros'); }} /></div>}
        </div>
      </main>
    </div>
  );
};

export default App;
