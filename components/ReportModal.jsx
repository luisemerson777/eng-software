
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const ReportModal = ({ data, onClose, onSaveToHistory }) => {
  const qrRef = useRef(null);
  
  useEffect(() => {
    if (qrRef.current) {
      // Gera um QR code
      const info = `Veículo: ${data.vehicle.brandModel} | Status: Pronto | AutoCheck`;
      QRCode.toCanvas(qrRef.current, info, {
        width: 80,
        margin: 1,
        color: { dark: '#1D63BD', light: '#f8fafc' }
      });
    }
  }, [data]);

  const handleWhatsApp = () => {
    const message = `*CERTIFICADO DE INSPEÇÃO - AUTOCHECK*%0A%0A` +
      `*Cliente:* ${data.client.name}%0A` +
      `*Veículo:* ${data.vehicle.brandModel} (${data.vehicle.plate})%0A%0A` +
      `*Valor do Serviço:* R$ ${data.totalValue}%0A%0A` +
      `*Resumo Técnico:*%0A` +
      `• Pneus: ${data.tires.grooves}%0A` +
      `• Bateria: ${data.electrical.batteryHealth}/5%0A` +
      `• Óleo Motor: ${data.fluids.engineOil}%0A%0A` +
      `*Peças Utilizadas:*%0A${data.partsUsed || 'Manutenção preventiva básica'}%0A%0A` +
      `*Seu veículo está pronto e seguro para rodar!*`;
    
    const phone = data.client.phone.replace(/\D/g, '');
    window.open(`https://api.whatsapp.com/send?phone=55${phone}&text=${message}`, '_blank');
  };

  const handleSave = () => {
    onSaveToHistory(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl my-8 overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Banner do Relatório */}
        <div className="p-8 bg-gradient-to-br from-[#1D63BD] to-cyan-500 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors no-print">
            <i className="fas fa-times text-xl"></i>
          </button>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <i className="fas fa-file-invoice text-3xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Certificado de Inspeção</h2>
              <p className="text-white/80 font-medium">Análise Técnica e Segurança</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] font-bold uppercase opacity-60">Proprietário</p>
              <p className="font-bold truncate">{data.client.name}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] font-bold uppercase opacity-60">Data da Inspeção</p>
              <p className="font-bold">{new Date(data.date).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-8">
          {/* Renderização Dinâmica de Resultados */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-[#1D63BD] rounded-full"></div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">
                  {data.type === 'moto' ? 'Análise Moto' : data.type ? `Análise ${data.type}` : 'Análise Geral'}
                </h4>
              </div>
              <canvas ref={qrRef} className="rounded-lg shadow-sm bg-white"></canvas>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Se for Carro */}
              {(!data.type || data.type === 'carro') && (
                <>
                  <ResultItem icon="fa-dharmachakra" label="Pneus" value={data.tires?.grooves} />
                  <ResultItem icon="fa-bolt" label="Bateria" value={`${data.electrical?.batteryHealth}/5 Saúde`} />
                  <ResultItem icon="fa-oil-can" label="Óleo Motor" value={data.fluids?.engineOil} />
                  <ResultItem icon="fa-wrench" label="Mecânica" value={data.mechanical?.leaks === 'OK' ? 'Sem Vazamentos' : data.mechanical?.leaks} />
                  <ResultItem icon="fa-circle-stop" label="Freios" value={data.brakes?.pads === 'OK' ? 'Pastilhas OK' : data.brakes?.pads} />
                  <ResultItem icon="fa-microchip" label="Scanner" value={data.scanner?.dtcErrors === 'Realizado' ? 'Sem Erros' : data.scanner?.dtcErrors} />
                  <ResultItem icon="fa-arrows-up-down-left-right" label="Geral" value={data.general?.suspension} />
                </>
              )}

              {/* Se for Moto */}
              {data.type === 'moto' && (
                <>
                  <ResultItem icon="fa-wrench" label="Mecânica" value={data.motos?.mechanical?.oilLevel} />
                  <ResultItem icon="fa-gears" label="Transmissão" value={data.motos?.transmission?.lubrication} />
                  <ResultItem icon="fa-circle-stop" label="Freios" value={data.motos?.brakes?.pads} />
                  <ResultItem icon="fa-microchip" label="Scanner" value={data.motos?.scanner?.dtcErrors} />
                  <ResultItem icon="fa-gauge-high" label="Sulco TWI" value={data.motos?.tires?.twi} />
                  <ResultItem icon="fa-bolt" label="Bateria" value={data.motos?.electrical?.battery} />
                </>
              )}

              {/* Se for Dinâmico */}
              {data.dynamic && Object.entries(data.dynamic).map(([label, value]) => (
                <ResultItem key={label} icon="fa-check-circle" label={label} value={value} />
              ))}
            </div>
          </section>

          {/* Dados do Veículo */}
          <section className="p-6 border-2 border-[#1D63BD]/10 rounded-3xl bg-blue-50/20 dark:bg-blue-900/10">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="text-xl font-black text-slate-800 dark:text-white">{data.vehicle?.brandModel || 'Modelo Não Informado'}</h3>
                 <p className="text-xs font-bold text-[#1D63BD]">{data.vehicle?.mileage || '0'} KM Rodados</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">Valor do Serviço</p>
                 <p className="text-xl font-black text-[#1D63BD]">R$ {data.totalValue}</p>
               </div>
            </div>
            <div className="flex justify-center mb-4">
               <span className="bg-white dark:bg-slate-800 px-6 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-lg font-mono font-bold text-slate-800 dark:text-white w-full text-center">
                 {data.vehicle?.plate || "S/ PLACA"}
               </span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2">Manutenção Realizada</h5>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{data.partsUsed || "Serviço de inspeção técnica padrão."}</p>
            </div>
          </section>

          {/* Notas */}
          <section>
             <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2">Notas do Especialista</h4>
             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-[#1D63BD]/20 dark:border-[#1D63BD]/40 pl-4">
               "{data.observations || "Veículo inspecionado e liberado com sucesso."}"
             </p>
          </section>
        </div>

        {/* Parte das ações */}
        <div className="p-8 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 no-print">
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleWhatsApp}
              className="flex-[2] py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-2xl shadow-lg shadow-green-100 dark:shadow-none transition-all flex items-center justify-center space-x-3"
            >
              <i className="fab fa-whatsapp text-xl"></i>
              <span>Enviar via WhatsApp</span>
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-4 bg-[#1D63BD] hover:bg-[#154A8D] text-white font-bold rounded-2xl shadow-lg shadow-blue-100 dark:shadow-none transition-all flex items-center justify-center space-x-3"
            >
              <i className="fas fa-save"></i>
              <span>Salvar no Histórico</span>
            </button>
          </div>
          <button 
            onClick={() => window.print()}
            className="w-full mt-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <i className="fas fa-print"></i>
            <span>Imprimir Certificado</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ icon, label, value }) => (
  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4">
    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1D63BD]">
      <i className={`fas ${icon} text-sm`}></i>
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{label}</p>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{value || 'N/A'}</p>
    </div>
  </div>
);

export default ReportModal;
