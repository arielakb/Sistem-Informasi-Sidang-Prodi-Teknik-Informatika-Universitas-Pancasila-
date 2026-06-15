export interface ValidationError {
  field: string;
  message: string;
}

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') return `${fieldName} wajib diisi`;
  return null;
};

export const validateMinLength = (value: string, min: number, fieldName: string): string | null => {
  if (value.length < min) return `${fieldName} minimal ${min} karakter`;
  return null;
};

export const validateMaxLength = (value: string, max: number, fieldName: string): string | null => {
  if (value.length > max) return `${fieldName} maksimal ${max} karakter`;
  return null;
};

export const validateEmail = (value: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Format email tidak valid';
  return null;
};