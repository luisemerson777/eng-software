import React from 'react';
import FormCard from './FormCard';

const CustomSectionList = ({
  customSections,
  isEditMode,
  newSectionTitle,
  setNewSectionTitle,
  newFieldLabels,
  setNewFieldLabels,
  onAddSection,
  onRemoveSection,
  onAddFieldToSection,
  onRemoveFieldFromSection,
  data,
  onDynamicChange
}) => (
  <div className="space-y-8">
    {isEditMode && (
      <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border-2 border-dashed border-[#1D63BD]/20">
        <label className="block text-xs font-black text-[#1D63BD] uppercase tracking-[0.2em] mb-4 text-center">
          Criar Nova Seção de Checklist
        </label>
        <div className="flex gap-3">
          <input
            className="flex-1 px-6 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-bold text-slate-800 dark:text-white shadow-sm"
            placeholder="Ex: Estado da Pintura, Tapeçaria..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddSection())}
          />
          <button
            type="button"
            onClick={onAddSection}
            className="px-8 bg-[#1D63BD] text-white font-black rounded-2xl hover:bg-[#154A8D] transition-all flex items-center space-x-2 shadow-lg shadow-blue-100 dark:shadow-none"
          >
            <i className="fas fa-plus"></i>
            <span>CRIAR SEÇÃO</span>
          </button>
        </div>
      </div>
    )}

    {customSections.map((section) => (
      <FormCard
        key={section.id}
        title={section.title}
        icon="fa-list-check"
        onRemove={isEditMode ? () => { if (window.confirm(`Deseja excluir a seção "${section.title}"?`)) onRemoveSection(section.id); } : null}
      >
        <div className="space-y-6">
          {isEditMode && (
            <div className="flex gap-2">
              <input
                className="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 dark:text-white"
                placeholder="Novo item para esta seção..."
                value={newFieldLabels[section.id] || ''}
                onChange={(e) => setNewFieldLabels((prev) => ({ ...prev, [section.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddFieldToSection(section.id))}
              />
              <button
                type="button"
                onClick={() => onAddFieldToSection(section.id)}
                className="px-6 bg-[#1D63BD] text-white font-bold rounded-2xl hover:bg-[#154A8D] transition-all"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {section.fields.map((field) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right-2"
              >
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => onRemoveFieldFromSection(section.id, field.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  )}
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                    {field.label}
                  </span>
                </div>

                <div className="flex gap-2">
                  {['OK', 'Atenção', 'Urgente'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => onDynamicChange(field.label, status)}
                      className={`px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                        data.dynamic?.[field.label] === status
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
);

export default CustomSectionList;
