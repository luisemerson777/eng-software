import React, { useState } from 'react';

const VehiclePicker = ({
  label,
  placeholder,
  value,
  onChange,
  savedVehicles = [],
  onDeleteVehicle,
  onFocus
}) => {
  const [showList, setShowList] = useState(false);

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-semibold text-slate-900 dark:text-white"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setShowList(true);
          onFocus?.();
        }}
      />

      {showList && savedVehicles.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 max-h-48 overflow-y-auto animate-in slide-in-from-top-2">
          <div className="flex justify-between items-center px-3 py-1 mb-2 border-b border-slate-50 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Modelos Salvos</span>
            <button type="button" onClick={() => setShowList(false)} className="text-slate-400">
              <i className="fas fa-times"></i>
            </button>
          </div>
          {savedVehicles.map((vehicle) => (
            <div key={vehicle} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl group">
              <button
                type="button"
                className="flex-1 text-left text-sm font-bold text-slate-600 dark:text-slate-300"
                onClick={() => {
                  onChange(vehicle);
                  setShowList(false);
                }}
              >
                {vehicle}
              </button>
              <button
                type="button"
                onClick={() => onDeleteVehicle(vehicle)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 transition-all hover:scale-110"
              >
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiclePicker;
