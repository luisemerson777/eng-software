export const formatCurrencyInput = (value) => {
  const digits = value.replace(/\D/g, '') || '0';
  return (parseInt(digits, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
};

export const sanitizePhone = (phone = '') => phone.replace(/\D/g, '');
