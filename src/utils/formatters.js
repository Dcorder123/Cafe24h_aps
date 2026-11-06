// Utilitários de formatação e máscaras para inputs

/**
 * Formata número de telefone celular no padrão brasileiro:
 * (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const formatPhone = (val) => {
  if (!val) return '';
  const digits = String(val).replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

/**
 * Aceita apenas dígitos numéricos inteiros
 */
export const onlyNumbers = (val, maxLen) => {
  if (!val) return '';
  const digits = String(val).replace(/\D/g, '');
  return maxLen ? digits.slice(0, maxLen) : digits;
};

/**
 * Aceita apenas valores numéricos decimais (com ponto)
 */
export const onlyDecimals = (val) => {
  if (!val) return '';
  // Remove tudo que não for dígito ou ponto
  const clean = String(val).replace(/[^0-9.]/g, '');
  // Garante apenas um ponto decimal
  const parts = clean.split('.');
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join('')}`;
  }
  return clean;
};

