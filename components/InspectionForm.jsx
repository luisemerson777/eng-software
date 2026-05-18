import React, { useState, useEffect } from 'react';
import { InspectionStatus } from '../constants';
import { formatCurrencyInput } from '../utils/formatters';
import CustomSectionList from './CustomSectionList';
import FormCard from './FormCard';
import SectionCard from './SectionCard';
import VehiclePicker from './VehiclePicker';

const InspectionForm = ({
  initialData,
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
    ...initialData,
    type: 'carro',
    dynamic: initialData.dynamic || {},
    mechanical: { airFilter: 'OK', leaks: 'OK' },
    brakes: { pads: 'OK', discs: 'OK' },
    scanner: { serviceReset: 'OK', dtcErrors: 'OK' },
    general: { steering: 'OK', suspension: 'OK' }
  });

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newFieldLabels, setNewFieldLabels] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setData((prev) => ({
      ...initialData,
      dynamic: prev.dynamic || {},
      mechanical: prev.mechanical || { airFilter: 'OK', leaks: 'OK' },
      brakes: prev.brakes || { pads: 'OK', discs: 'OK' },
      scanner: prev.scanner || { serviceReset: 'OK', dtcErrors: 'OK' },
      general: prev.general || { steering: 'OK', suspension: 'OK' }
    }));
  }, [initialData]);

  const handleInputChange = (section, field, value) => {
    setData((prev) => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null && !Array.isArray(sectionData)) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      }
      return { ...prev, [section]: value };
    });
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
      id: data.id || `insp-${Date.now()}`,
      date: data.date || new Date().toISOString()
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

      <FormCard title="Dados do Cliente" icon="fa-user-tie">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Nome Completo *</label>
            <input
              required
              className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-semibold text-slate-900 dark:text-white"
              placeholder="Ex: João da Silva"
              value={data.client.name}
              onChange={(e) => handleInputChange('client', 'name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">WhatsApp / Telefone *</label>
            <input
              required
              className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-semibold text-slate-900 dark:text-white"
              placeholder="11 99999-9999"
              value={data.client.phone}
              onChange={(e) => handleInputChange('client', 'phone', e.target.value)}
            />
          </div>
        </div>
      </FormCard>

      <FormCard title="Dados do Veículo" icon="fa-car-side">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <VehiclePicker
              label="Marca / Modelo / Ano *"
              placeholder="Ex: BMW 320i M Sport 2023"
              value={data.vehicle.brandModel}
              onChange={(value) => handleInputChange('vehicle', 'brandModel', value)}
              savedVehicles={savedVehicles}
              onDeleteVehicle={onDeleteVehicle}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Placa / KM</label>
            <div className="flex gap-2">
              <input
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-mono font-bold uppercase text-slate-900 dark:text-white"
                placeholder="ABC-1234"
                value={data.vehicle.plate}
                onChange={(e) => handleInputChange('vehicle', 'plate', e.target.value)}
              />
              <input
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-bold text-slate-900 dark:text-white"
                placeholder="KM"
                value={data.vehicle.mileage}
                onChange={(e) => handleInputChange('vehicle', 'mileage', e.target.value)}
              />
            </div>
          </div>
        </div>
      </FormCard>

      <FormCard title="Mecânica" icon="fa-wrench">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'airFilter', label: 'Filtro de Ar', icon: 'fa-wind' },
            { id: 'leaks', label: 'Vazamentos de Motor/Câmbio', icon: 'fa-droplet-slash' }
          ].map((item) => (
            <div key={item.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <i className={`fas ${item.icon} text-[#1D63BD] text-xs`}></i>
                <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['OK', 'Atenção', 'Urgente'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleInputChange('mechanical', item.id, status)}
                    className={`flex-1 py-2 text-[9px] font-bold rounded-lg border transition-all ${
                      data.mechanical?.[item.id] === status
                        ? 'bg-[#1D63BD] text-white border-[#1D63BD]'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800'
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

      <FormCard title="Sistema de Freios" icon="fa-circle-stop">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'pads', label: 'Pastilhas e Lonas', icon: 'fa-hockey-puck' },
            { id: 'discs', label: 'Discos e Tambores', icon: 'fa-compact-disc' }
          ].map((item) => (
            <div key={item.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <i className={`fas ${item.icon} text-[#1D63BD] text-xs`}></i>
                <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['OK', 'Atenção', 'Urgente'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleInputChange('brakes', item.id, status)}
                    className={`flex-1 py-2 text-[9px] font-bold rounded-lg border transition-all ${
                      data.brakes?.[item.id] === status
                        ? 'bg-[#1D63BD] text-white border-[#1D63BD]'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800'
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

      <FormCard title="Scanner e Diagnóstico" icon="fa-microchip">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'serviceReset', label: 'Reset de Serviço', icon: 'fa-rotate-left' },
            { id: 'dtcErrors', label: 'Leitura de Erros (DTC)', icon: 'fa-triangle-exclamation' }
          ].map((item) => (
            <div key={item.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <i className={`fas ${item.icon} text-[#1D63BD] text-xs`}></i>
                <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['Realizado', 'Pendente', 'N/A'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleInputChange('scanner', item.id, status)}
                    className={`flex-1 py-2 text-[9px] font-bold rounded-lg border transition-all ${
                      data.scanner?.[item.id] === status
                        ? 'bg-[#1D63BD] text-white border-[#1D63BD]'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800'
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

      <FormCard title="Suspensão e Direção" icon="fa-arrows-up-down-left-right">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'steering', label: 'Caixa de Direção/Folgas', icon: 'fa-steering-wheel' },
            { id: 'suspension', label: 'Amortecedores/Suspensão', icon: 'fa-wrench' }
          ].map((item) => (
            <div key={item.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <i className={`fas ${item.icon} text-[#1D63BD] text-xs`}></i>
                <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {['OK', 'Folga', 'Urgente'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleInputChange('general', item.id, status)}
                    className={`flex-1 py-2 text-[9px] font-bold rounded-lg border transition-all ${
                      data.general?.[item.id] === status
                        ? 'bg-[#1D63BD] text-white border-[#1D63BD]'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800'
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

      <SectionCard
        title="Rodagem e Pneus"
        icon="fa-tire"
        items={[
          { id: 'grooves', label: 'Sulcos dos Pneus', icon: 'fa-gauge-simple-high' },
          { id: 'pressure', label: 'Pressão / Calibragem', icon: 'fa-compress' },
          { id: 'spare', label: 'Estado do Estepe', icon: 'fa-life-ring' }
        ]}
        currentData={data.tires}
        onSelect={(id, value) => handleInputChange('tires', id, value)}
        options={[InspectionStatus.GOOD, InspectionStatus.ACCEPTABLE, InspectionStatus.REPLACE]}
        gridClass="grid-cols-1 sm:grid-cols-3 gap-4"
      />

      <SectionCard
        title="Verificação de Fluidos"
        icon="fa-oil-can"
        items={[
          { id: 'engineOil', label: 'Óleo do Motor', icon: 'fa-oil-can' },
          { id: 'brakeFluid', label: 'Fluido de Freio', icon: 'fa-circle-exclamation' },
          { id: 'coolant', label: 'Líquido de Arrefecimento', icon: 'fa-temperature-half' },
          { id: 'wiperFluid', label: 'Limpador de Para-brisa', icon: 'fa-droplet' },
          { id: 'transmissionFluid', label: 'Fluido de Transmissão', icon: 'fa-gears' }
        ]}
        currentData={data.fluids}
        onSelect={(id, value) => handleInputChange('fluids', id, value)}
        options={[InspectionStatus.OK, InspectionStatus.LOW, InspectionStatus.CHANGE_REQUIRED]}
      />

      <FormCard title="Segurança e Iluminação" icon="fa-shield-halved">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'headlights', label: 'Faróis Principais', icon: 'fa-lightbulb' },
            { id: 'tailLights', label: 'Lanternas Traseiras', icon: 'fa-lightbulb' },
            { id: 'turnSignals', label: 'Setas / Piscas', icon: 'fa-arrows-left-right' },
            { id: 'wipers', label: 'Limpadores / Palhetas', icon: 'fa-windshield' }
          ].map((item) => (
            <div key={item.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <i className={`fas ${item.icon} text-[#1D63BD] text-xs`}></i>
                <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
              </div>
              <div className="flex gap-2">
                {[InspectionStatus.OK, InspectionStatus.MINOR_DEFECT, InspectionStatus.MAJOR_DEFECT].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleInputChange('safety', item.id, status)}
                    className={`flex-1 py-2 text-[9px] font-bold rounded-lg border transition-all ${
                      data.safety[item.id] === status
                        ? 'bg-[#1D63BD] text-white border-[#1D63BD]'
                        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            data.safety.horn ? 'border-[#1D63BD] bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
          }`}>
            <div className="flex items-center space-x-3">
              <i className={`fas fa-bullhorn ${data.safety.horn ? 'text-[#1D63BD]' : 'text-slate-300 dark:text-slate-700'}`}></i>
              <span className={`text-sm font-bold ${data.safety.horn ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}`}>
                Buzina OK
              </span>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 accent-[#1D63BD]"
              checked={data.safety.horn}
              onChange={(e) => handleInputChange('safety', 'horn', e.target.checked)}
            />
          </label>
        </div>
      </FormCard>

      <SectionCard
        title="Sistema Elétrico"
        icon="fa-bolt"
        items={[
          { id: 'alternator', label: 'Carga do Alternador', icon: 'fa-charging-station' },
          { id: 'belts', label: 'Estado das Correias', icon: 'fa-life-ring' }
        ]}
        currentData={data.electrical}
        onSelect={(id, value) => handleInputChange('electrical', id, value)}
        options={[InspectionStatus.OK, InspectionStatus.MINOR_DEFECT, InspectionStatus.MAJOR_DEFECT]}
      />

      <FormCard title="Checkout Final" icon="fa-clipboard-check">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'testDrive', label: 'Test Drive Realizado', icon: 'fa-gauge-high' },
            { id: 'wheelTorque', label: 'Torque de Rodas OK', icon: 'fa-wrench' },
            { id: 'cleaning', label: 'Limpeza Externa/Interna', icon: 'fa-sparkles' },
            { id: 'personalObjects', label: 'Sem Objetos Esquecidos', icon: 'fa-suitcase' }
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                data.checkout[item.id]
                  ? 'border-[#1D63BD] bg-blue-50/50 dark:bg-blue-900/10'
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <i className={`fas ${item.icon} ${data.checkout[item.id] ? 'text-[#1D63BD]' : 'text-slate-300 dark:text-slate-700'}`}></i>
                <span className={`text-sm font-bold ${data.checkout[item.id] ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-600'}`}>
                  {item.label}
                </span>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#1D63BD]"
                checked={data.checkout[item.id]}
                onChange={(e) => handleInputChange('checkout', item.id, e.target.checked)}
              />
            </label>
          ))}
        </div>
      </FormCard>

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

      <FormCard title="Resumo do Serviço" icon="fa-file-lines">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Peças Utilizadas</label>
            <textarea
              rows={3}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
              placeholder="Ex: Óleo 5W30, Filtro, Velas..."
              value={data.partsUsed}
              onChange={(e) => handleInputChange('partsUsed', '', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Notas Adicionais para o Cliente</label>
            <textarea
              rows={3}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
              placeholder="Ex: Próxima troca em 10.000km..."
              value={data.observations}
              onChange={(e) => handleInputChange('observations', '', e.target.value)}
            />
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Valor Total da Inspeção / Serviço *</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400 dark:text-slate-600">R$</span>
              <input
                required
                type="text"
                className="w-full pl-12 pr-5 py-4 bg-blue-50/50 dark:bg-blue-900/10 border-2 border-transparent focus:border-[#1D63BD] rounded-2xl outline-none font-black text-2xl text-[#1D63BD] placeholder:text-blue-200 dark:placeholder:text-blue-900/30 transition-all"
                placeholder="0,00"
                value={data.totalValue}
                onChange={(e) => handleInputChange('totalValue', '', formatCurrencyInput(e.target.value))}
              />
            </div>
          </div>
        </div>
      </FormCard>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          className="flex-[2] py-5 bg-[#1D63BD] hover:bg-[#154A8D] text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3"
        >
          <i className="fas fa-check-double"></i>
          <span className="text-lg">Gerar Certificado de Inspeção</span>
        </button>
      </div>
    </form>
  );
};

export default InspectionForm;
