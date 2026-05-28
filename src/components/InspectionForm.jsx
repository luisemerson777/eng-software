import React, { useState, useEffect } from 'react';
import { INITIAL_FORM_STATE } from '../constants';

// Formulário de inspeção simplificado e independente
const InspectionForm = ({ initialData = INITIAL_FORM_STATE, onSubmit }) => {
  const [data, setData] = useState({ ...INITIAL_FORM_STATE, ...initialData });

  useEffect(() => setData(prev => ({ ...prev, ...initialData })), [initialData]);

  const handleChange = (path, value) => {
    const parts = path.split('.');
    setData(prev => {
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        cur[p] = { ...(cur[p] || {}) };
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...data, id: data.id || `insp-${Date.now()}`, date: data.date || new Date().toISOString() };
    if (onSubmit) onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100">
        <h3 className="font-bold mb-3">Dados do Cliente</h3>
        <input className="w-full mb-2 p-3 rounded-xl border" placeholder="Nome" value={data.client?.name || ''} onChange={(e) => handleChange('client.name', e.target.value)} />
        <input className="w-full mb-2 p-3 rounded-xl border" placeholder="Telefone" value={data.client?.phone || ''} onChange={(e) => handleChange('client.phone', e.target.value)} />
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100">
        <h3 className="font-bold mb-3">Dados do Veículo</h3>
        <input className="w-full mb-2 p-3 rounded-xl border" placeholder="Marca / Modelo / Ano" value={data.vehicle?.brandModel || ''} onChange={(e) => handleChange('vehicle.brandModel', e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input className="p-3 rounded-xl border" placeholder="Placa" value={data.vehicle?.plate || ''} onChange={(e) => handleChange('vehicle.plate', e.target.value)} />
          <input className="p-3 rounded-xl border" placeholder="KM" value={data.vehicle?.mileage || ''} onChange={(e) => handleChange('vehicle.mileage', e.target.value)} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100">
        <h3 className="font-bold mb-3">Resumo</h3>
        <label className="block text-xs font-bold mb-1">Peças Utilizadas</label>
        <textarea className="w-full p-3 rounded-xl border mb-3" rows={2} value={data.partsUsed || ''} onChange={(e) => handleChange('partsUsed', e.target.value)} />
        <label className="block text-xs font-bold mb-1">Observações</label>
        <textarea className="w-full p-3 rounded-xl border mb-3" rows={3} value={data.observations || ''} onChange={(e) => handleChange('observations', e.target.value)} />
        <label className="block text-xs font-bold mb-1">Valor Total (R$)</label>
        <input className="w-full p-3 rounded-xl border" placeholder="0,00" value={data.totalValue || ''} onChange={(e) => handleChange('totalValue', e.target.value)} />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="flex-1 py-3 bg-[#1D63BD] text-white rounded-xl font-bold">Salvar Inspeção</button>
      </div>
    </form>
  );
};

export default InspectionForm;
