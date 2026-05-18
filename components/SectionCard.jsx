import React from 'react';
import FormCard from './FormCard';

const SectionCard = ({
  title,
  icon,
  items,
  currentData,
  onSelect,
  options,
  gridClass = 'grid-cols-1 sm:grid-cols-2 gap-4'
}) => (
  <FormCard title={title} icon={icon}>
    <div className={`grid ${gridClass}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2">
            <i className={`fas ${item.icon} text-[#1D63BD] text-xs`}></i>
            <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
          </div>
          <div className="flex gap-2">
            {options.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onSelect(item.id, status)}
                className={`flex-1 py-2 text-[9px] font-bold rounded-lg border transition-all ${
                  currentData?.[item.id] === status
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
);

export default SectionCard;
