import React, { useState, useEffect } from 'react';
import { INITIAL_FORM_STATE } from '../constants';
import { formatCurrencyInput } from '../utils/formatters';
import CustomSectionList from './CustomSectionList';
import FormCard from './FormCard';
import SectionCard from './SectionCard';
import VehiclePicker from './VehiclePicker';

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

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newFieldLabels, setNewFieldLabels] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      dynamic: prev.dynamic || {}
    }));
  }, []);

  const handleInputChange = (category, field, value) => {
    setData((prev) => ({
      ...prev,
      [category]: typeof prev[category] === 'object' && field
        ? { ...prev[category], [field]: value }
        : value
    }));
  };

  const handleMotoChange = (group, field, value) => {
    setData((prev) => ({
      ...prev,
      motos: {
        ...prev.motos,
        [group]: { ...prev.motos[group], [field]: value }
      }
    }));
  };

  const handleDynamicChange = (label, value) => {
    setData((prev) => ({
      ...prev,
      dynamic: { ...prev.dynamic, [label]: value }
    }));
  };

  const handleAddSection = () => {
    const title = newSectionTitle.trim();
    if (!title) return;
    onAddSection(title);
    setNewSectionTitle('');
  };

  const handleAddFieldLocal = (sectionId) => {
    const label = (newFieldLabels[sectionId] || '').trim();
    if (!label) return;
    onAddFieldToSection(sectionId, label);
    setNewFieldLabels((prev) => ({ ...prev, [sectionId]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const finalData = {
      ...data,
      id: data.id || `moto-${Date.now()}`,
      date: data.date || new Date().toISOString()
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end sticky top-4 z-40">
        <button
          type="button"
          onClick={() => setIsEditMode((value) => !value)}
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
          <VehiclePicker
            label="Marca / Modelo *"
            placeholder="Ex: Honda CG 160"
            value={data.vehicle.brandModel}
            onChange={(value) => handleInputChange('vehicle', 'brandModel', value)}
            savedVehicles={savedVehicles}
            onDeleteVehicle={onDeleteVehicle}
          />
          <input
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white font-mono uppercase"
            placeholder="Placa"
            value={data.vehicle.plate}
            onChange={(e) => handleInputChange('vehicle', 'plate', e.target.value)}
          />
        </div>
      </FormCard>

      <SectionCard
        title="Mecânica"
        icon="fa-wrench"
        items={[
          { id: 'oilLevel', label: 'Nível do Óleo', icon: 'fa-oil-can' },
          { id: 'airFilter', label: 'Filtro de Ar', icon: 'fa-wind' },
          { id: 'leaks', label: 'Vazamentos', icon: 'fa-droplet-slash' }
        ]}
        currentData={data.motos.mechanical}
        onSelect={(id, value) => handleMotoChange('mechanical', id, value)}
        options={['OK', 'Regular', 'Crítico']}
      />

      <SectionCard
        title="Transmissão"
        icon="fa-gears"
        items={[
          { id: 'chainTension', label: 'Tensão da Corrente', icon: 'fa-link' },
          { id: 'kitWear', label: 'Desgaste do Kit', icon: 'fa-gear' },
          { id: 'lubrication', label: 'Lubrificação', icon: 'fa-oil-can' }
        ]}
        currentData={data.motos.transmission}
        onSelect={(id, value) => handleMotoChange('transmission', id, value)}
        options={['OK', 'Regular', 'Crítico']}
      />

      <SectionCard
        title="Sistema de Freios"
        icon="fa-circle-stop"
        items={[
          { id: 'pads', label: 'Pastilhas/Lonas', icon: 'fa-hockey-puck' },
          { id: 'fluidLevel', label: 'Nível do Fluido', icon: 'fa-droplet' },
          { id: 'discs', label: 'Discos de Freio', icon: 'fa-compact-disc' }
        ]}
        currentData={data.motos.brakes}
        onSelect={(id, value) => handleMotoChange('brakes', id, value)}
        options={['OK', 'Regular', 'Crítico']}
      />

      <SectionCard
        title="Scanner e Diagnóstico"
        icon="fa-microchip"
        items={[
          { id: 'serviceReset', label: 'Reset de Serviço', icon: 'fa-rotate-left' },
          { id: 'dtcErrors', label: 'Leitura de Erros (DTC)', icon: 'fa-triangle-exclamation' }
        ]}
        currentData={data.motos.scanner}
        onSelect={(id, value) => handleMotoChange('scanner', id, value)}
        options={['Realizado', 'Pendente', 'N/A']}
      />

      <SectionCard
        title="Verificação Geral"
        icon="fa-magnifying-glass"
        items={[
          { id: 'steeringHead', label: 'Caixa de Direção', icon: 'fa-compass' },
          { id: 'suspension', label: 'Suspensão (Vazamentos)', icon: 'fa-wrench' }
        ]}
        currentData={data.motos.general}
        onSelect={(id, value) => handleMotoChange('general', id, value)}
        options={['OK', 'Folga', 'Crítico']}
      />

      <SectionCard
        title="Pneus e Rodas"
        icon="fa-dharmachakra"
        items={[
          { id: 'twi', label: 'Sulco (TWI)', icon: 'fa-gauge-high' },
          { id: 'pressure', label: 'Calibragem', icon: 'fa-wind' },
          { id: 'wheelCondition', label: 'Estado da Roda', icon: 'fa-circle-dot' }
        ]}
        currentData={data.motos.tires}
        onSelect={(id, value) => handleMotoChange('tires', id, value)}
        options={['OK', 'Regular', 'Crítico']}
      />

      <SectionCard
        title="Sistema Elétrico"
        icon="fa-bolt"
        items={[
          { id: 'battery', label: 'Nível da Bateria', icon: 'fa-car-battery' },
          { id: 'lights', label: 'Faróis / Lanternas', icon: 'fa-lightbulb' },
          { id: 'signals', label: 'Setas / Buzina', icon: 'fa-bullhorn' }
        ]}
        currentData={data.motos.electrical}
        onSelect={(id, value) => handleMotoChange('electrical', id, value)}
        options={['OK', 'Falha', 'Revisar']}
      />

      <CustomSectionList
        customSections={customSections}
        isEditMode={isEditMode}
        newSectionTitle={newSectionTitle}
        setNewSectionTitle={setNewSectionTitle}
        newFieldLabels={newFieldLabels}
        setNewFieldLabels={setNewFieldLabels}
        onAddSection={handleAddSection}
        onRemoveSection={onRemoveSection}
        onAddFieldToSection={handleAddFieldLocal}
        onRemoveFieldFromSection={onRemoveFieldFromSection}
        data={data}
        onDynamicChange={handleDynamicChange}
      />

      <FormCard title="Resumo e Valor" icon="fa-receipt">
        <div className="space-y-4">
          <textarea
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white"
            placeholder="Peças Utilizadas (ex: Óleo, Filtro...)"
            value={data.partsUsed}
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
              onChange={(e) => handleInputChange('totalValue', '', formatCurrencyInput(e.target.value))}
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
