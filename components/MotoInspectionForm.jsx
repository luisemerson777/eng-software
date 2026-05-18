import React, { useState } from 'react';
import FormCard from './FormCard';
import { INITIAL_FORM_STATE } from '../constants';

const MotoInspectionForm = ({ 
  onSubmit, 
  customSections = [], 
  onAddSection, 
  onRemoveSection, 
  onAddFieldToSection, 
  onRemoveFieldFromSection, 
  savedVehicles = [], 
  onDeleteVehicle 
}) => {
  const [data, setData] = useState({
    ...INITIAL_FORM_STATE,
    type: 'moto',
    motos: {
      tires: { twi: 'OK', pressure: 'OK', wheelCondition: 'OK' },
      electrical: { battery: 'OK', lights: 'OK', signals: 'OK' },
      mechanical: { oilLevel: 'OK', airFilter: 'OK', leaks: 'OK' },
      transmission: { chainTension: 'OK', kitWear: 'OK', lubrication: 'OK' },
      brakes: { pads: 'OK', fluidLevel: 'OK', discs: 'OK' },
      scanner: { serviceReset: 'OK', dtcErrors: 'OK' },
      general: { steeringHead: 'OK', suspension: 'OK' }
    },
    dynamic: {}
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newFieldLabels, setNewFieldLabels] = useState({});
  const [showVehicleList, setShowVehicleList] = useState(false);

  const handleInputChange = (category, field, value) => {
    setData(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' && field
        ? { ...prev[category], [field]: value }
        : value
    }));
  };

  const handleDynamicChange = (label, value) => {
    setData(prev => ({
      ...prev,
      dynamic: { ...prev.dynamic, [label]: value }
    }));
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    onAddSection(newSectionTitle);
    setNewSectionTitle('');
  };

  const handleAddFieldLocal = (sectionId) => {
    const label = newFieldLabels[sectionId];
    if (!label?.trim()) return;
    onAddFieldToSection(sectionId, label);
    setNewFieldLabels(prev => ({ ...prev, [sectionId]: '' }));
  };

  const handleMotoChange = (group, field, value) => {
    setData(prev => ({
      ...prev,
      motos: {
        ...prev.motos,
        [group]: { ...prev.motos[group], [field]: value }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...data,
      id: data.id || `moto-${Date.now()}`,
      date: new Date().toISOString()
    };
    onSubmit(finalData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end sticky top-4 z-40">
        <button 
          type="button"
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
            isEditMode 
              ? 'bg-green-500 text-white shadow-green-100' 
              : 'bg-white dark:bg-slate-900 text-[#1D63BD] border border-blue-50 dark:border-slate-800'
          }`}
        >
          <i className={`fas ${isEditMode ? 'fa-save' : 'fa-gear'}`}></i>
          <span>{isEditMode ? 'Finalizar Edição' : 'Personalizar Checklist'}</span>
        </button>
      </div>

      {/* Dados do Cliente */}
      <FormCard title="Dados do Cliente" icon="fa-user">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            required
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white"
            placeholder="Nome Completo *"
            value={data.client.name}
            onChange={(e) => handleInputChange('client', 'name', e.target.value)}
          />
          <input 
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white"
            placeholder="Telefone (WhatsApp)"
            value={data.client.phone}
            onChange={(e) => handleInputChange('client', 'phone', e.target.value)}
          />
        </div>
      </FormCard>

      <FormCard title="Dados da Moto" icon="fa-motorcycle">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <input 
              required
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white"
              placeholder="Marca / Modelo *"
              value={data.vehicle.brandModel}
              onChange={(e) => handleInputChange('vehicle', 'brandModel', e.target.value)}
              onFocus={() => setShowVehicleList(true)}
            />
            {showVehicleList && savedVehicles.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 max-h-48 overflow-y-auto animate-in scale-in">
                <div className="flex justify-between items-center px-3 py-1 mb-2 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Motos Usadas</span>
                  <button type="button" onClick={() => setShowVehicleList(false)} className="text-slate-400"><i className="fas fa-times"></i></button>
                </div>
                {savedVehicles.map(v => (
                  <div key={v} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl group">
                    <button 
                      type="button"
                      className="flex-1 text-left text-sm font-bold text-slate-600 dark:text-slate-300"
                      onClick={() => { handleInputChange('vehicle', 'brandModel', v); setShowVehicleList(false); }}
                    >
                      {v}
                    </button>
                    <button 
                      type="button"
                      onClick={() => onDeleteVehicle(v)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 transition-all"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input 
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white font-mono uppercase"
            placeholder="Placa"
            value={data.vehicle.plate}
            onChange={(e) => handleInputChange('vehicle', 'plate', e.target.value)}
          />
        </div>
      </FormCard>

      {/* Mecânica */}
      <FormCard title="Mecânica" icon="fa-wrench">
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'oilLevel', label: 'Nível do Óleo', icon: 'fa-oil-can' },
            { id: 'airFilter', label: 'Filtro de Ar', icon: 'fa-wind' },
            { id: 'leaks', label: 'Vazamentos', icon: 'fa-droplet-slash' }
          ].map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1D63BD]">
                  <i className={`fas ${item.icon} text-sm`}></i>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['OK', 'Regular', 'Crítico'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleMotoChange('mechanical', item.id, status)}
                    className={`flex-1 px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                      data.motos.mechanical?.[item.id] === status
                        ? 'bg-[#1D63BD] border-[#1D63BD] text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Transmissão */}
      <FormCard title="Transmissão" icon="fa-gears">
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'chainTension', label: 'Tensão da Corrente', icon: 'fa-link' },
            { id: 'kitWear', label: 'Desgaste do Kit', icon: 'fa-gear' },
            { id: 'lubrication', label: 'Lubrificação', icon: 'fa-oil-can' }
          ].map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1D63BD]">
                  <i className={`fas ${item.icon} text-sm`}></i>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['OK', 'Regular', 'Crítico'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleMotoChange('transmission', item.id, status)}
                    className={`flex-1 px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                      data.motos.transmission?.[item.id] === status
                        ? 'bg-[#1D63BD] border-[#1D63BD] text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Freios */}
      <FormCard title="Sistema de Freios" icon="fa-circle-stop">
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'pads', label: 'Pastilhas/Lonas', icon: 'fa-hockey-puck' },
            { id: 'fluidLevel', label: 'Nível do Fluido', icon: 'fa-droplet' },
            { id: 'discs', label: 'Discos de Freio', icon: 'fa-compact-disc' }
          ].map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1D63BD]">
                  <i className={`fas ${item.icon} text-sm`}></i>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['OK', 'Regular', 'Crítico'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleMotoChange('brakes', item.id, status)}
                    className={`flex-1 px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                      data.motos.brakes?.[item.id] === status
                        ? 'bg-[#1D63BD] border-[#1D63BD] text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Scanner */}
      <FormCard title="Scanner e Diagnóstico" icon="fa-microchip">
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'serviceReset', label: 'Reset de Serviço', icon: 'fa-rotate-left' },
            { id: 'dtcErrors', label: 'Leitura de Erros (DTC)', icon: 'fa-triangle-exclamation' }
          ].map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1D63BD]">
                  <i className={`fas ${item.icon} text-sm`}></i>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['Realizado', 'Pendente', 'N/A'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleMotoChange('scanner', item.id, status)}
                    className={`flex-1 px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                      data.motos.scanner?.[item.id] === status
                        ? 'bg-[#1D63BD] border-[#1D63BD] text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Geral */}
      <FormCard title="Verificação Geral" icon="fa-magnifying-glass">
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'steeringHead', label: 'Caixa de Direção', icon: 'fa-compass' },
            { id: 'suspension', label: 'Suspensão (Vazamentos)', icon: 'fa-wrench' }
          ].map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1D63BD]">
                  <i className={`fas ${item.icon} text-sm`}></i>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['OK', 'Folga', 'Crítico'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleMotoChange('general', item.id, status)}
                    className={`flex-1 px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                      data.motos.general?.[item.id] === status
                        ? 'bg-[#1D63BD] border-[#1D63BD] text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FormCard>
      <FormCard title="Pneus e Rodas" icon="fa-dharmachakra">
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'twi', label: 'Sulco (TWI)', icon: 'fa-gauge-high' },
            { id: 'pressure', label: 'Calibragem', icon: 'fa-wind' },
            { id: 'wheelCondition', label: 'Estado da Roda', icon: 'fa-circle-dot' }
          ].map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1D63BD]">
                  <i className={`fas ${item.icon} text-sm`}></i>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['OK', 'Regular', 'Crítico'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleMotoChange('tires', item.id, status)}
                    className={`flex-1 px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                      data.motos.tires[item.id] === status
                        ? 'bg-[#1D63BD] border-[#1D63BD] text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Elétrica */}
      <FormCard title="Sistema Elétrico" icon="fa-bolt">
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'battery', label: 'Nível da Bateria', icon: 'fa-car-battery' },
            { id: 'lights', label: 'Faróis / Lanternas', icon: 'fa-lightbulb' },
            { id: 'signals', label: 'Setas / Buzina', icon: 'fa-bullhorn' }
          ].map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1D63BD]">
                  <i className={`fas ${item.icon} text-sm`}></i>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['OK', 'Falha', 'Revisar'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleMotoChange('electrical', item.id, status)}
                    className={`flex-1 px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                      data.motos.electrical[item.id] === status
                        ? 'bg-[#1D63BD] border-[#1D63BD] text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Seções Personalizadas */}
      <div className="space-y-6">
        {isEditMode && (
          <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border-2 border-dashed border-[#1D63BD]/20 text-center">
            <label className="block text-xs font-black text-[#1D63BD] uppercase tracking-widest mb-4">Criar Novo Grupo de Itens</label>
            <div className="flex gap-2">
              <input 
                className="flex-1 px-5 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-bold text-slate-800 dark:text-white"
                placeholder="Ex: Pintura, Acessórios..."
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSection())}
              />
              <button 
                type="button" 
                onClick={handleAddSection}
                className="px-6 bg-[#1D63BD] text-white font-bold rounded-2xl hover:bg-[#154A8D] transition-all"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        )}

        {customSections.map(section => (
          <FormCard 
            key={section.id} 
            title={section.title} 
            icon="fa-list-check"
            onRemove={isEditMode ? () => { if(window.confirm(`Excluir o grupo "${section.title}"?`)) onRemoveSection(section.id) } : null}
          >
            <div className="space-y-4">
              {isEditMode && (
                <div className="flex gap-2">
                  <input 
                    className="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white"
                    placeholder="Novo item..."
                    value={newFieldLabels[section.id] || ''}
                    onChange={(e) => setNewFieldLabels(prev => ({ ...prev, [section.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFieldLocal(section.id))}
                  />
                  <button 
                    type="button" 
                    onClick={() => handleAddFieldLocal(section.id)}
                    className="px-4 bg-[#1D63BD] text-white font-bold rounded-xl hover:bg-[#154A8D] transition-all"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {section.fields.map(field => (
                  <div key={field.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                      {isEditMode && (
                        <button 
                          type="button"
                          onClick={() => onRemoveFieldFromSection(section.id, field.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all focus:outline-none"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      )}
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">{field.label}</span>
                    </div>
                    <div className="flex gap-2">
                      {['OK', 'Regular', 'Crítico'].map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleDynamicChange(field.label, status)}
                          className={`flex-1 px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                            data.dynamic[field.label] === status
                              ? 'bg-[#1D63BD] border-[#1D63BD] text-white shadow-lg shadow-blue-100 dark:shadow-none'
                              : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-blue-200'
                          }`}
                        >
                          {status.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FormCard>
        ))}
      </div>

      <FormCard title="Resumo e Valor" icon="fa-receipt">
         <div className="space-y-4">
            <textarea 
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white"
              placeholder="Peças Utilizadas (ex: Óleo, Filtro...)"
              value={data.partsUsed || ''}
              onChange={(e) => handleInputChange('partsUsed', '', e.target.value)}
            />
            <textarea 
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white"
              placeholder="Observações..."
              value={data.observations}
              onChange={(e) => handleInputChange('observations', '', e.target.value)}
            />
            <div className="relative pt-2">
               <span className="absolute left-5 top-[60%] -translate-y-1/2 font-bold text-slate-400">R$</span>
               <input 
                required
                className="w-full pl-12 pr-5 py-4 bg-blue-50/50 dark:bg-blue-900/10 border-2 border-transparent focus:border-[#1D63BD] rounded-2xl outline-none font-black text-2xl text-[#1D63BD]"
                placeholder="0,00"
                value={data.totalValue}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '');
                  if (val === '') val = '0';
                  const formatted = (parseInt(val) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                  handleInputChange('totalValue', '', formatted);
                }}
               />
            </div>
         </div>
      </FormCard>

      <button 
        type="submit"
        className="w-full py-6 bg-[#1D63BD] hover:bg-[#154A8D] text-white font-black text-lg rounded-3xl shadow-2xl shadow-blue-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95"
      >
        GERAR RELATÓRIO MOTO
      </button>
    </form>
  );
};

export default MotoInspectionForm;
