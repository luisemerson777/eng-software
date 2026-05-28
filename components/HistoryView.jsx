import React, { useState, useMemo } from 'react';

// Lista simples de inspeções (histórico)
const HistoryView = ({ history = [], onDelete, onViewReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const totalBilling = useMemo(
    () => history.reduce((sum, item) => {
      const value = String(item.totalValue || '0').replace(/\./g, '').replace(',', '.');
      return sum + (Number(value) || 0);
    }, 0),
    [history]
  );

  const filtered = useMemo(
    () => history
      .filter((item) => {
        const search = searchTerm.toLowerCase();
        return [item.client?.name, item.vehicle?.plate, item.vehicle?.brandModel]
          .some((value) => value?.toLowerCase().includes(search));
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [history, searchTerm]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1D63BD] p-6 rounded-[2rem] text-white shadow-xl flex items-center justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-blue-100/70 text-xs font-bold uppercase tracking-wider mb-2">Faturamento</p>
            <h2 className="text-3xl font-black"><span className="text-lg font-medium opacity-60 mr-1">R$</span>{totalBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"><i className="fas fa-wallet"></i></div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Serviços</p>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white">{history.length}<span className="text-lg font-medium text-slate-300 dark:text-slate-700 ml-2">un.</span></h2>
          </div>
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl text-[#1D63BD] group-hover:scale-110 transition-transform"><i className="fas fa-clipboard-check"></i></div>
        </div>
      </div>

      <div className="relative group">
        <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-[#1D63BD] transition-colors"></i>
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#1D63BD] outline-none font-medium text-slate-900 dark:text-white transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
          <i className="fas fa-folder-open text-4xl text-slate-200 dark:text-slate-800 mb-4"></i>
          <p className="text-slate-400 dark:text-slate-600 font-medium">Nenhum registro.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 border transition-all duration-300 overflow-hidden ${expandedId === item.id ? 'rounded-[2rem] border-blue-200 dark:border-blue-900 shadow-xl' : 'rounded-2xl border-slate-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900 shadow-sm'}`}
            >
              <div className="p-5 flex items-center justify-between cursor-pointer select-none" onClick={() => setExpandedId((current) => (current === item.id ? null : item.id))}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${expandedId === item.id ? 'bg-[#1D63BD] text-white' : 'bg-blue-50 dark:bg-blue-900/20 text-[#1D63BD]'}`}><i className="fas fa-car"></i></div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-white truncate">{item.client?.name || '—'}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">{item.vehicle?.brandModel || '—'} • <span className="font-mono uppercase">{item.vehicle?.plate || 'S/P'}</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1 shrink-0 ml-4">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase">{item.date ? new Date(item.date).toLocaleDateString('pt-BR') : '—'}</span>
                  <i className={`fas fa-chevron-down text-slate-300 dark:text-slate-700 transition-transform ${expandedId === item.id ? 'rotate-180 text-[#1D63BD]' : ''}`}></i>
                </div>
              </div>
              {expandedId === item.id && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-50 dark:border-slate-800 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pt-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase mb-1">Pneus</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.tires?.grooves || '—'}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase mb-1">Bateria</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.electrical?.batteryHealth ?? '—'}/5</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase mb-1">Óleo</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.fluids?.engineOil || '—'}</p>
                    </div>
                    <div className="bg-[#1D63BD]/5 dark:bg-[#1D63BD]/10 p-3 rounded-xl border border-[#1D63BD]/10 col-span-2 sm:col-span-1">
                      <p className="text-[9px] font-bold text-[#1D63BD] uppercase mb-1">Total</p>
                      <p className="text-xs font-black text-[#1D63BD]">R$ {item.totalValue || '0,00'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onViewReport && onViewReport(item); }}
                      className="flex-[2] py-3.5 bg-[#1D63BD] text-white text-xs font-bold rounded-xl hover:bg-[#154A8D] transition-all flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <i className="fas fa-file-invoice"></i>
                      <span>Relatório</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete && onDelete(item.id); }}
                      className="flex-1 py-3.5 bg-red-50 dark:bg-red-900/10 text-red-500 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-2 border border-red-100 dark:border-red-900/30"
                    >
                      <i className="fas fa-trash-alt"></i>
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
